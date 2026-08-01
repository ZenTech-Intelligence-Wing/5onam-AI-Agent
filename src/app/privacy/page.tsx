export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>

        <p className="text-gray-600 mb-6">
          Last Updated: August 2026
        </p>

        <div className="space-y-6 text-gray-700 leading-7">

          <section>
            <h2 className="text-2xl font-semibold mb-2">
              1. Information We Collect
            </h2>
            <p>
              We collect information that you provide during registration,
              such as your name, email address, and account details.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">
              2. How We Use Your Information
            </h2>
            <p>
              Your information is used to provide, improve, and secure our
              services and to communicate with you.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">
              3. Data Security
            </h2>
            <p>
              We take reasonable measures to protect your personal information
              against unauthorized access or disclosure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">
              4. Contact Us
            </h2>
            <p>
              If you have any questions regarding this Privacy Policy,
              please contact our support team.
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}