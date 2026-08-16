'use client';
export default function AdminInvoicesPage() {

  return (

    <>

      <main className="min-h-screen bg-gray-100 p-8">

        <div className="max-w-7xl mx-auto">

          <div className="flex justify-between items-center mb-8">

            <h1 className="text-5xl font-bold">
              🧾 Invoices
            </h1>

            <button
              className="bg-black text-white px-6 py-3 rounded-xl"
            >
              Export CSV
            </button>

          </div>

          <div className="grid grid-cols-4 gap-6 mb-8">

            <div className="bg-white rounded-3xl p-6 shadow">

              <p className="text-gray-500">
                Total Invoices
              </p>

              <h2 className="text-4xl font-bold mt-2">
                0
              </h2>

            </div>

            <div className="bg-white rounded-3xl p-6 shadow">

              <p className="text-gray-500">
                Paid Invoices
              </p>

              <h2 className="text-4xl font-bold mt-2 text-green-600">
                0
              </h2>

            </div>

            <div className="bg-white rounded-3xl p-6 shadow">

              <p className="text-gray-500">
                Pending Invoices
              </p>

              <h2 className="text-4xl font-bold mt-2 text-orange-500">
                0
              </h2>

            </div>

            <div className="bg-white rounded-3xl p-6 shadow">

              <p className="text-gray-500">
                Revenue
              </p>

              <h2 className="text-4xl font-bold mt-2 text-blue-600">
                KES 0
              </h2>

            </div>

          </div>

          <div className="bg-white rounded-3xl shadow-lg p-6">

            <h2 className="text-2xl font-bold mb-4">
              Invoice Records
            </h2>

            <p className="text-gray-500">
              Invoice table coming next...
            </p>

          </div>

        </div>

      </main>

    </>
  );
}