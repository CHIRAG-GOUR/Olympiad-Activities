# Firebase — `olympiad-dashboard`

Written for: whoever wires this app to the Firebase project.

The codebase is already provider-agnostic. Every screen talks to a repository
interface; `src/repositories/index.ts` picks the local implementation or the
Firestore one from a single environment variable. Nothing below changes any
application code.

---

## 1. What is already pointed at the project

| File | Now set to |
| --- | --- |
| `.firebaserc` | `olympiad-dashboard` (default and production) |
| `src/services/firebase/config.ts` | fallback project id, auth domain, bucket |
| `.env.example` | project id, auth domain, bucket |
| `firestore.rules` | rewritten (see §4) |
| `storage.rules` | rewritten (see §4) |

## 2. What is still needed from the console

Open **Project settings → General → Your apps → Web app**, and copy the config
into `.env.local` (and into the Vercel project's environment variables):

```dotenv
NEXT_PUBLIC_DATA_PROVIDER=firebase

NEXT_PUBLIC_FIREBASE_API_KEY=            # AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=olympiad-dashboard.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=olympiad-dashboard
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=     # copy exactly — newer projects use
                                         # olympiad-dashboard.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

If no web app is registered yet, add one — the Firestore database alone does not
produce these keys.

`NEXT_PUBLIC_DATA_PROVIDER=firebase` is ignored unless a real API key is present,
so a missing key degrades to the local store rather than crashing.

## 3. Collections this app reads and writes

These names are fixed in `src/repositories/firebase/*`. If the existing database
uses different ones, say so and the repositories will be pointed at them —
otherwise the app will read empty collections and silently fall back to local
data, which looks like "Firebase is connected but nothing shows up".

| Collection | Holds | Written by |
| --- | --- | --- |
| `exams` | Exam definitions, sections, rules, timing | Staff |
| `questions` | Question text, options, `correctOptionId`, activity config | Staff |
| `subjects` | Subject, chapters, topics | Staff |
| `users` | Profile and role | Admin (own profile by owner) |
| `examSessions` | Live progress and heartbeats during a paper | The candidate sitting it |
| `attempts` | Submitted papers | The candidate |
| `reports` | Evaluated results | Staff / the candidate's own |

Uploaded paper scans belong in Cloud Storage under `papers/`, not Firestore.

## 4. Two things to know before switching the provider on

**Firebase Auth is not wired yet.** Sign-in currently runs through
`LocalAuthService`, so `request.auth` is null. The rules in `firestore.rules`
correctly require authentication, which means flipping
`NEXT_PUBLIC_DATA_PROVIDER=firebase` today would have every read denied — and
because the Firestore repositories fall back to local data on error, that failure
would be invisible. **Wire Firebase Auth first**, then switch the provider.

Sign-in must also set a `role` custom claim (`SUPER_ADMIN`, `TEACHER`, or
`STUDENT`) via the Admin SDK. The Firestore rules fall back to reading
`/users/{uid}.role`, but Storage rules cannot read Firestore and depend on the
claim alone.

**Scoring still runs in the browser.** `evaluateAndGenerateFullResult` compares
the candidate's answer against `correctOptionId` client-side, so any signed-in
candidate can read the answer key straight out of `questions`. The rules close
this to the anonymous public, which is a strict improvement, but the real fix is
to move evaluation into a Cloud Function and strip `correctOptionId` from client
reads. Worth doing before the platform is used for a paper that matters.

## 5. Deploying the rules

```bash
npx firebase-tools login
npx firebase-tools deploy --only firestore:rules,storage --project olympiad-dashboard
```

Review the diff in the console first — the previous rules allowed unauthenticated
writes to `examSessions` and public reads of `questions`, so anything relying on
that behaviour will stop working, which is the point.
