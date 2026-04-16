
const Hightlight = () => {
  const promises = [
    {
      icon: (
        <img
          src="/Easy_30_Days_Return.png"
          loading="lazy"
          alt=""
        />
      ),
      text: "Easy 30 Days Return",
    },
    {
      icon: <img src="/100_Exchange.png" loading="lazy" alt="" />,
      text: "100% Exchange",
    },
    {
      icon: (
        <img
          src="/Life_Time_Buyback.png"
          loading="lazy"
          alt=""
        />
      ),
      text: "80% Life Time Buyback",
    },
    {
      icon: (
        <img src="/Hallmarked_Gold.png" loading="lazy" alt="" />
      ),
      text: "Hallmarked Gold",
    },
    {
      icon: (
        <img
          src="/Certified_Diamond_Jewelry.png"
          loading="lazy"
          alt=""
        />
      ),
      text: "Certified Diamond Jewelry",
    },
    {
      icon: <img src="/Free_Shipping.png" loading="lazy" alt="" />,
      text: "Free Shipping",
    },
  ];

  return (
    <div className="w-full mt-4 p-4 sm:p-6 bg-white rounded-none  border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-800 mb-3 sm:mb-5 tracking-wide">
        OUR PROMISE
      </h2>

      <ul className=" grid grid-cols-2 sm:grid-cols-3 items-center gap-6 ">
        {promises.map((item, index) => (
          <li key={index} className="flex items-center gap-4">
            <span className="flex items-center justify-center w-6 sm:w-8 h-6 sm:h-8 rounded-full bg-white">
              {item.icon}
            </span>
            <span className="text-gray-700 font-medium text-xs sm:text-sm">
              {item.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Hightlight;
