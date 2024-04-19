import { useEffect, useState } from "react";
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
        name: "Nasi Goreng",
        quantity: 2,
      },
    ],
  },
];

function App() {
  const [orderList, setOrderList] = useState(initialData);
  const [totalItems, setTotalItems] = useState([]);
  const [name, setName] = useState('');
  const [fnb, setFnb] = useState('');
  const [uniqueNames, setUniqueNames] = useState([]);
  const [uniqueFnb, setUniqueFnb] = useState([]);
  const [nameOptions, setNameOptions] = useState([]);
  const [fnbOptions, setFnbOptions] = useState([]);

  useEffect(() => {
    calculateTotalItems();
    getUniqueNames();
    getUniqueFnb();
  }, [orderList]);

  useEffect(() => {
    if (name.length >= 3) {
      filterNameOptions();
    } else {
      setNameOptions([]);
    }
  }, [name]);

  useEffect(() => {
    if (fnb.length >= 3) {
      filterFnbOptions();
    } else {
      setFnbOptions([]);
    }
  }, [fnb]);

  function getUniqueNames() {
    const names = orderList.map(customer => customer.name);
    const uniqueNames = [...new Set(names)];
    setUniqueNames(uniqueNames);
  }

  function getUniqueFnb() {
    const fnbArray = orderList.flatMap(customer => customer.items.map(item => item.name));
    const uniqueFnb = [...new Set(fnbArray)];
    setUniqueFnb(uniqueFnb);
  }

  function filterNameOptions() {
    const filteredNames = uniqueNames.filter(option => option.toLowerCase().includes(name.toLowerCase()));
    setNameOptions(filteredNames);
  }

  function filterFnbOptions() {
    const filteredFnb = uniqueFnb.filter(option => option.toLowerCase().includes(fnb.toLowerCase()));
    setFnbOptions(filteredFnb);
  }

  function handleSubmit(e) {
    e.preventDefault();

    const existingNameIndex = orderList.findIndex(customer => customer.name === name);
    if (existingNameIndex !== -1) {
      const existingItemIndex = orderList[existingNameIndex].items.findIndex(item => item.name === fnb);

      if (existingItemIndex !== -1) {
        const newOrderList = [...orderList];
        newOrderList[existingNameIndex].items[existingItemIndex].quantity++;
        setOrderList(newOrderList);
      } else {
        const newOrderList = [...orderList];
        newOrderList[existingNameIndex].items.push(
          {
            id: uuid(),
            name: fnb,
            quantity: 1,
          }
        );
        setOrderList(newOrderList);
      }

    } else {
      const newOrderList = {
        name: name,
        items: [
          {
            id: uuid(),
            name: fnb,
            quantity: 1,
          }
        ]
      }
      setOrderList([...orderList, newOrderList]);
    }

    console.log(calculateTotalItems());
  }

  function calculateTotalItems() {
    const totalItem = [];

    orderList.forEach(list => {
      list.items.forEach(item => {
        let totalIndex = totalItem.findIndex(total => total.name === item.name);
        if (totalIndex !== -1) {
          totalItem[totalIndex].quantity += item.quantity;
        } else {
          totalItem.push({
            name: item.name,
            quantity: item.quantity,
          });
        }
      });
    });

    setTotalItems(totalItem);
  }

  function handleIncreaseQuantity(id) {
    const newOrderList = orderList.map((list) => ({
      ...list,
      items: list.items.map((item) => {
        if (item.id === id) {
          return { ...item, quantity: item.quantity + 1 }
        }
        return item;
      }),
    }));

    setOrderList(newOrderList);
  }

  function handleDecreaseQuantity(id) {
    const newOrderList = orderList.map((list) => ({
      ...list,
      items: list.items.map((item) => {
        if (item.id === id) {
          if (item.quantity === 1) {
            return { ...item, quantity: 1 }
          }
          return { ...item, quantity: item.quantity - 1 }
        }
        return item;
      }),
    }));

    setOrderList(newOrderList);
  }

  function handleRemoveItem(id) {
    const newOrderList = orderList.map((list) => ({
      ...list,
      items: list.items.filter((item) => item.id !== id),
    }));

    // Filter out customers with no items left
    const filteredOrderList = newOrderList.filter((customer) => customer.items.length > 0);

    setOrderList(filteredOrderList);
  }

  function handleRemoveAllItems(name) {
    const newOrderList = orderList.map((list) => ({
      ...list,
      items: list.items.filter((item) => item.name !== name),
    }));

    // Filter out customers with no items left
    const filteredOrderList = newOrderList.filter((customer) => customer.items.length > 0);

    setOrderList(filteredOrderList);
  }

  return (
    <div className="m-12 flex h-[calc(100vh-6rem)] gap-8 rounded-lg">
      <div className="w-7/12 rounded-lg bg-white p-8">
        <h2 className="text-3xl mb-6 font-extrabold">Order List</h2>
        <ul className="flex flex-col gap-4 overflow-y-auto h-[calc(100%-3.66rem)]">
          {orderList.map((list) => (
            <li key={list.name} className="rounded-lg border-2 px-4 py-2">
              <h4 className="mb-2 text-lg font-bold">{list.name}</h4>
              <ul className="divide-y-2 divide-[#BEC7CD] ">
                {list.items.map((item) => (
                  <li key={item.id} className="flex items-center justify-between px-6 py-3 first:pt-1 last:pb-1" >
                    <div className="flex gap-4">
                      <span><i className="fa-duotone fa-list-ul"></i></span>
                      <span className="font-bold">{item.name}</span>
                    </div>
                    <div className="flex gap-4 *:align-middle">
                      <div className="inline-flex gap-4 rounded-full bg-[#EBEEF0] px-6 py-3 shadow-md group-hover:bg-[#BEC7CD]">
                        <button onClick={() => handleDecreaseQuantity(item.id)}>
                          <i className="fa-regular fa-minus hover:text-slate-300"></i>
                        </button>
                        <span className="w-[3ch] text-center font-bold">{item.quantity}</span>
                        <button onClick={() => handleIncreaseQuantity(item.id)}>
                          <i className="fa-regular fa-plus hover:text-slate-300"></i>
                        </button>
                      </div>
                      <button onClick={() => handleRemoveItem(item.id)} type="button" className="hover:opacity-80">
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
          <form onSubmit={handleSubmit}>
            <div className="mb-2 flex items-center rounded-lg border-2 border-[#BEC7CD] px-4 focus:border-[#091C2F]">
              <span>
                <i className="fa-duotone fa-user"></i>
              </span>
              <input type="text" className="ms-4 w-full py-3 font-bold" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} list="nameOptions" />
              <datalist id="nameOptions">
                {nameOptions.map((option, index) => (
                  <option key={index} value={option} />
                ))}
              </datalist>
            </div>

            <div className="mb-2 flex items-center rounded-lg border-2 border-[#BEC7CD] px-4 focus:border-[#091C2F]">
              <span>
                <i className="fa-duotone fa-pot-food"></i>
              </span>
              <input type="text" className="ms-4 w-full py-3 font-bold" placeholder="Food or Beverage" value={fnb} onChange={(e) => setFnb(e.target.value)} list="fnbOptions" />
              <datalist id="fnbOptions">
                {fnbOptions.map((option, index) => (
                  <option key={index} value={option} />
                ))}
              </datalist>
            </div>

            <button className="ml-auto block rounded-lg border-2 border-[#BEC7CD] px-4 py-2 font-bold hover:bg-slate-100 hover:text-slate-500">
              Submit
            </button>
          </form>
        </div>

        <div className="rounded-lg bg-white p-8">
          <h1 className="mb-6 text-3xl font-extrabold">Total Items</h1>
          <ul className="mt-4 h-[200px] divide-y-2 divide-[#BEC7CD] overflow-y-scroll border-y-2 border-[#BEC7CD] text-lg font-bold">
            {totalItems.map((item) => (
              <li key={item.name} className="group flex items-center justify-between px-8 py-6 hover:bg-[#E7F0F7]" >
                <div>
                  <span>
                    <i className="fa-duotone fa-list-ul"></i>
                  </span>
                  <span className="ms-4">{item.name}</span>
                </div>
                <div className="flex gap-4 *:align-middle">
                  <div className="inline-flex gap-4 rounded-full bg-[#EBEEF0] px-6 py-3 shadow-md group-hover:bg-[#BEC7CD]">
                    <span className="w-[3ch] text-center">{item.quantity}</span>
                  </div>
                  <button onClick={() => handleRemoveAllItems(item.name)} type="button" className="hover:opacity-80">
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
