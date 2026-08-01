export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>

        <p className="text-gray-600 mb-6">
          Last Updated: August 2026
        </p>

        <div className="space-y-6 text-gray-700 leading-7">

          <section>
            <h2 className="text-2xl font-semibold mb-2">
              1. Acceptance of Terms
            </h2>
            <p>
              By creating an account and using Sonam AI, you agree to comply
              with these Terms of Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">
              2. User Responsibilities
            </h2>
            <p>
              You are responsible for maintaining your account security and
              using the platform responsibly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">
              3. Account Usage
            </h2>
            <p>
              You must not misuse the platform, upload malicious content, or
              violate applicable laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">
              4. Termination
            </h2>
            <p>
              We reserve the right to suspend or terminate accounts that violate
              these Terms.
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}