# Firebase — `olympiad-dashboard`

Written for: whoever runs this project's Firebase setup.

---

## ⚠️ The one thing to know first

This Firebase project is **shared with the Minty Finance app**, whose data lives in
the `(default)` Firestore database.

Firestore security rules are **per database and replace wholesale**. Deploying the
Olympiad's rules to `(default)` would revoke Minty Finance's access, because they
end in a catch-all deny.

So the Olympiad was given **its own database**:

| Database | Edition | Region | Belongs to |
| --- | --- | --- | --- |
| `(default)` | Standard | — | **Minty Finance — do not deploy rules here** |
| `default` | Enterprise | — | pre-existing, untouched |
| **`olympiad`** | Standard | asia-south1 | **this app** |

Two things keep them apart, and both matter:

- `firebase.json` declares `firestore` as an **array** with `"database": "olympiad"`.
  The object form deploys to `(default)`. Do not convert it back.
- `src/services/firebase/config.ts` calls `getFirestore(app, "olympiad")`.
  Plain `getFirestore(app)` would read and write Minty Finance's data.

`storage.rules` is deliberately **not** wired into `firebase.json` for the same
reason — the storage bucket is shared too. See the note at the top of that file.

---

## Current state

| | |
| --- | --- |
| Project | `olympiad-dashboard` ("Olympiad - Minty"), number `669684257120` |
| Firestore database | `olympiad`, Standard, `asia-south1` — created and live |
| Firestore rules | **deployed** to `olympiad` |
| Storage rules | written, namespaced under `olympiad/`, **not deployed** (shared bucket) |
| Web config | in `.env.local` (git-ignored) |
| Data provider | `local` — see "Before switching on" below |
| Sign-in | Firebase Authentication. No credentials in this repository. |

`npx firebase-tools` is logged in as `pa1@skillizee.io`.

---

## Outstanding — in order

### 1. Enable Email/Password sign-in

Console → **Authentication → Sign-in method → Email/Password → Enable**.

https://console.firebase.google.com/project/olympiad-dashboard/authentication/providers

### 2. Create the staff accounts — immediately after step 1

```bash
npm run firebase:staff
```

Creates the three Super Admin accounts with generated passwords and prints them
once. Accounts that already exist are left alone.

> **Do this in the same sitting as step 1.** The sign-up endpoint is public
> (the web API key ships in the browser bundle, by design). `firestore.rules`
> grants Super Admin to three known addresses to solve the bootstrap problem —
> so while one of those addresses has no account, someone else could register it
> and inherit administrator rights. Creating the accounts takes the addresses out
> of circulation.

### 3. Switch the data provider on

In `.env.local` and in Vercel's environment variables:

```dotenv
NEXT_PUBLIC_DATA_PROVIDER=firebase
```

The `olympiad` database is empty, so the app will show no exams until content is
written to it. The two seeded papers currently live in browser storage only.

### 4. Replace the email allow-list with role claims

`isFoundingAdmin()` in `firestore.rules` and `bootstrapRoleFor()` in
`src/lib/auth/rbac.ts` are a bootstrap, not a destination. Once the Admin SDK can
issue a `role` custom claim (`SUPER_ADMIN` / `TEACHER` / `STUDENT`) at sign-in,
delete both. Storage rules depend on the claim regardless — they cannot read
Firestore, so staff uploads will not work until claims exist.

### 5. Move scoring server-side

`evaluateAndGenerateFullResult` compares answers against `correctOptionId` in the
browser, so any signed-in candidate can read the answer key out of `questions`.
The rules close this to the anonymous public, which is a strict improvement, but
the real fix is a Cloud Function that evaluates server-side and strips
`correctOptionId` from client reads. Worth doing before a paper that counts.

---

## Collections

Fixed in `src/repositories/firebase/*`. All in the `olympiad` database.

| Collection | Holds | Written by |
| --- | --- | --- |
| `exams` | Exam definitions, sections, rules, timing | Staff |
| `questions` | Question text, options, `correctOptionId`, activity config | Staff |
| `subjects` | Subject, chapters, topics | Staff |
| `users` | Profile and role | Admin; owner may edit their own, not their role |
| `examSessions` | Live progress and heartbeats during a paper | The candidate sitting it |
| `attempts` | Submitted papers | The candidate |
| `reports` | Evaluated results | Staff, or the candidate's own |

Uploaded paper scans belong in Cloud Storage under `olympiad/papers/`.

---

## How roles are resolved

In order, first match wins:

1. `role` custom claim on the ID token — preferred: costs no read, and the user
   cannot edit it.
2. `/users/{uid}.role` in Firestore.
3. The founding-admin list (bootstrap only — see step 4 above).
4. Otherwise `STUDENT`.

A user may edit their own `/users/{uid}` document but **not** its `role` or
`status`; the rules reject that write, so nobody can promote themselves.

---

## Hosting on Firebase

### Firebase App Hosting (Recommended for Next.js 15 App Router)

Next.js 15 App Router utilizes dynamic SSR routes (`/exam/[examId]`, `/results/[attemptId]`, `/teacher/exams/[id]`). **Firebase App Hosting** provides native Next.js 15 support with Cloud Build and Cloud Run.

Configuration is already committed in [`apphosting.yaml`](file:///e:/1.%20Skillizee/Club%20Activities/Olympiad%20Activity/apphosting.yaml).

**Setup Steps in Firebase Console:**
1. Open the [Firebase App Hosting Console](https://console.firebase.google.com/project/olympiad-dashboard/apphosting).
2. Click **Get Started** (or **Create Backend**).
3. Connect your GitHub repository: `CHIRAG-GOUR/Olympiad-Activities`.
4. Select deployment branch: `main`.
5. Select region: `asia-south1` (or closest available).
6. Set Backend ID: `the-olympiad-platform` (or similar).
7. Firebase automatically builds using `apphosting.yaml` and deploys your live production URL.

---

## Commands

```bash
# deploy rules — scoped to the olympiad database by firebase.json
npx firebase-tools deploy --only firestore:rules --project olympiad-dashboard

# create staff accounts (needs Email/Password enabled)
npm run firebase:staff

# what databases exist
npx firebase-tools firestore:databases:list --project olympiad-dashboard

# list hosting sites
npx firebase-tools hosting:sites:list --project olympiad-dashboard
```

Never run `firebase deploy` without `--only`, and never add `storage` back to
`firebase.json` — both would reach Minty Finance's resources.
