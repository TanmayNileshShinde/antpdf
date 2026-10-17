import { Metadata } from 'next';
import { BASE_URL } from '@/lib/seo/toolsData';

export const metadata: Metadata = {
  title: 'Terms of Service | AnTPDF',
  description:
    'Terms of Service for using AnTPDF — the open-source, client-side PDF studio.',
  alternates: {
    canonical: `${BASE_URL}/terms`,
  },
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
          Terms of Service
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Last updated: October 2026
        </p>
      </div>

      <div className="space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing and using AnTPDF (https://antpdf.tanmayshinde.com), you agree to be bound by these
            Terms of Service. If you do not agree to these terms, you should discontinue using the application.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            2. Open Source License (MIT)
          </h2>
          <p>
            AnTPDF is open-source software authored collaboratively by Tanmay Nilesh Shinde and Antara Parab.
            The source code is licensed under the MIT License and hosted publicly on GitHub.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            3. Disclaimer of Warranties
          </h2>
          <p>
            AnTPDF is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, either express or implied.
            While every effort has been made to ensure standard PDF compliance and data integrity, you are advised to maintain
            original backup copies of important documents.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            4. Permitted Use
          </h2>
          <p>
            You agree to use AnTPDF only for lawful purposes. You must have appropriate rights and authorization
            to access, merge, split, encrypt, or decrypt any documents you process with this service.
          </p>
        </section>
      </div>
    </div>
  );
}
