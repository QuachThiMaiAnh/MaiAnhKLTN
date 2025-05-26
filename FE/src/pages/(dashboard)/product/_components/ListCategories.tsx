const ListCategories = () => {
  const listCategories = [
    {
      id: 1,
      name: "Category 1",
    },
    {
      id: 2,
      name: "Category 2",
    },
    {
      id: 3,
      name: "Category 3",
    },
    {
      id: 4,
      name: "Category 4",
    },
    {
      id: 5,
      name: "Category 5",
    },
    {
      id: 6,
      name: "Category 6",
    },
    {
      id: 7,
      name: "Category 7",
    },
    {
      id: 8,
      name: "Category 8",
    },
    {
      id: 9,
      name: "Category 9",
    },
    {
      id: 10,
      name: "Category 10",
    },
    {
      id: 11,
      name: "Category 11",
    },
    {
      id: 12,
      name: "Category 12",
    },
    {
      id: 13,
      name: "Category 13",
    },
    {
      id: 14,
      name: "Category 14",
    },
    {
      id: 15,
      name: "Category 15",
    },
  ];

  return (
    <ul className="mt-3 border-y py-5 flex overflow-x-auto whitespace-nowrap gap-4">
      {listCategories.map((category) => (
        <li
          key={category.id}
          className="flex text-sm items-center justify-between py-2 px-4 border bg-orange-500 text-white rounded-md"
        >
          <span className="">{category.name}</span>
        </li>
      ))}
    </ul>
  );
};

export default ListCategories;
