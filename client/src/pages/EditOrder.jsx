const EditOrder = ({selectedOrder, setSelectedOrder, setIsEditMode}) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full z-50  flex items-center justify-center bg-black-80">
      <div className="bg-white rounded-xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
        <form  className="space-y-6" omSubmit={() => console.log(selectedOrder)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paper Size
              </label>
              <select
                value={selectedOrder.paperSize}
                onChange={(e) =>
                  setSelectedOrder({
                    ...selectedOrder,
                    paperSize: e.target.value,
                  })
                }
                className="w-full border rounded-lg px-4 py-2"
              >
                <option value="A4">A4</option>
                <option value="A3">A3</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color Mode
              </label>
              <select
                value={selectedOrder.printType}
                onChange={(e) =>
                  setSelectedOrder({
                    ...selectedOrder,
                    printType: e.target.value,
                  })
                }
                className="w-full border rounded-lg px-4 py-2"
              >
                <option value="Black & White">Black & White</option>
                <option value="Color">Color</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sides
              </label>
              <select
                value={selectedOrder.sides}
                onChange={(e) =>
                  setSelectedOrder({
                    ...selectedOrder,
                    sides: e.target.value,
                  })
                }
                className="w-full border rounded-lg px-4 py-2"
              >
                <option value="Single-sided">Single-sided</option>
                <option value="Double-sided">Double-sided</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Copies
              </label>
              <input
                type="number"
                min="1"
                value={selectedOrder.copies}
                onChange={(e) =>
                  setSelectedOrder({
                    ...selectedOrder,
                    copies: parseInt(e.target.value),
                  })
                }
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>
          </div>

          <div className="flex justify-end pt-6 space-x-4">
              <button
                type="button"
                onClick={() => {
                  setIsEditMode(false);
                  setSelectedOrder(null);
                }}
                className="px-6 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
              >
                Close
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Save Changes
              </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditOrder;
