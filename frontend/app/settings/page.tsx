export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">
          Profile Settings
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full border rounded-xl p-3"
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full border rounded-xl p-3"
          />

          <input
            type="text"
            placeholder="Company Name"
            className="w-full border rounded-xl p-3"
          />

          <button className="bg-indigo-600 text-white px-5 py-3 rounded-xl">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}