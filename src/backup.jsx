import { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";

const initialData = [
  {
    name: "Christy",
    items: [
      {
        id: uuid(),
        name: "Nasi Goreng",
        quantity: 1,
      },
      {
        id: uuid(),
        name: "Ayam Bakar Negeri Dada",
        quantity: 5,
      },
    ],
  },
  {
    name: "Kenya",
    items: [
      {
        id: uuid(),
        name: "Bakmi Kuah",
        quantity: 2,
      },
    ],
  },
];

function App() {
  const [orderList, setOrderList] = useState(initialData);
  const [totalItems, setTotalItems] = useState({});

  useEffect(() => {
    calculateTotalItems();
  }, [orderList]);

  const calculateTotalItems = () => {
    const total = {};
    orderList.forEach((order) => {
      order.items.forEach((item) => {
        if (total[item.name]) {
          total[item.name] += item.quantity;
        } else {
          total[item.name] = item.quantity;
        }
      });
    });
    setTotalItems(total);
  };

  function handleRemoveItem(id) {
    const newOrderList = orderList.map((order) => ({
      ...order,
      items: order.items.filter((item) => item.id !== id),
    }));
    setOrderList(newOrderList);
  }

  function handleAddQuantity(id) {
    const newOrderList = orderList.map((order) => ({
      ...order,
      items: order.items.map((item) => {
        if (item.id === id) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      }),
    }));
    setOrderList(newOrderList);
  }

  function handleSubtractQuantity(id) {
    const newOrderList = orderList.map((order) => ({
      ...order,
      items: order.items.map((item) => {
        if (item.id === id && item.quantity > 1) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      }),
    }));
    setOrderList(newOrderList);
  }

  function handleRemoveAllItems(name) {
    const newOrderList = orderList.filter(order => {
      return order.items.every(item => item.name !== name);
    });
    setOrderList(newOrderList);
  }

  return (
    <div className="m-12 flex h-[calc(100vh-6rem)] gap-8 rounded-lg">
      <div className="w-7/12 rounded-lg bg-white p-8">
        <ul className="grid gap-4">
          {orderList.map((order) => (
            <li key={order.name} className="rounded-lg border-2 px-4 py-2">
              <h4 className="mb-2 text-lg font-bold">{order.name}</h4>
              <ul className="divide-y-2 divide-[#BEC7CD] ">
                {order.items.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between px-6 py-3 first:pt-1 last:pb-1"
                  >
                    <div>
                      <span>
                        {" "}
                        <i className="fa-duotone fa-list-ul"></i>{" "}
                      </span>
                      <span className="font-bold">{item.name}</span>
                    </div>
                    <div className="flex gap-4 *:align-middle">
                      <div className="inline-flex gap-4 rounded-full bg-[#EBEEF0] px-6 py-3 shadow-md group-hover:bg-[#BEC7CD]">
                        <button onClick={() => handleSubtractQuantity(item.id)}>
                          <i className="fa-regular fa-minus hover:text-slate-300"></i>
                        </button>
                        <span className="w-[3ch] text-center font-bold">
                          {item.quantity}
                        </span>
                        <button onClick={() => handleAddQuantity(item.id)}>
                          <i className="fa-regular fa-plus hover:text-slate-300"></i>
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="hover:opacity-80"
                      >
                        <i className="fa-duotone fa-trash text-xl"></i>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
      <div className="grid w-5/12 grid-rows-[max-content_auto] gap-4">
        <div className="rounded-lg bg-white p-8">
          <h1 className="mb-6 text-3xl font-extrabold">
            Customer input fields
          </h1>
          <form action="" className="">
            <div className="mb-2 flex items-center rounded-lg border-2 border-[#BEC7CD] px-4 focus:border-[#091C2F]">
              <span>
                <i className="fa-duotone fa-user"></i>
              </span>
              <input type="text" className="ms-4 w-full py-3 font-bold" placeholder="Name" />
            </div>

            <div className="mb-2 flex items-center rounded-lg border-2 border-[#BEC7CD] px-4 focus:border-[#091C2F]">
              <span>
                <i className="fa-duotone fa-pot-food"></i>
              </span>
              <input type="text" className="ms-4 w-full py-3 font-bold" placeholder="Food or Beverage" />
            </div>

            <button className="ml-auto block rounded-lg border-2 border-[#BEC7CD] px-4 py-2 font-bold hover:bg-slate-100 hover:text-slate-500">
              Submit
            </button>
          </form>
        </div>

        <div className="rounded-lg bg-white p-8">
          <h1 className="mb-6 text-3xl font-extrabold">Total Items</h1>
          <ul className="mt-4 h-[200px] divide-y-2 divide-[#BEC7CD] overflow-y-scroll border-y-2 border-[#BEC7CD] text-lg font-bold">
            {Object.entries(totalItems).map(([itemName, quantity]) => (
              <li key={itemName} className="group flex items-center justify-between px-8 py-6 hover:bg-[#E7F0F7]" >
                <div>
                  <span>
                    <i className="fa-duotone fa-list-ul"></i>
                  </span>
                  <span className="ms-4">{itemName}</span>
                </div>
                <div className="flex gap-4 *:align-middle">
                  <div className="inline-flex gap-4 rounded-full bg-[#EBEEF0] px-6 py-3 shadow-md group-hover:bg-[#BEC7CD]">
                    <span className="w-[3ch] text-center">{quantity}</span>
                  </div>
                  <button type="button" onClick={() => handleRemoveAllItems(itemName)} className="hover:opacity-80">
                    <i className="fa-duotone fa-trash text-xl"></i>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
