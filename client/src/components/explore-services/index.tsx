import Image from "next/image";

function Services() {
  return (
    <div className="w-full flex flex-col items-center justify-center py-10 sm:py-10 px-8 sm:px-10 md:px-20 lg:px-30">
      <div className="flex flex-col items-center justify-center mb-8 sm:mb-16 space-y-1">
        <h1 className="text-md sm:text-lg font-semibold text-gray-700">
          CATEGORY
        </h1>
        <h1 className="text-2xl sm:text-4xl font-bold text-center">
          We offer Best Services
        </h1>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-12 md:gap-16  w-full">
        <div className="rounded-4xl transition-all ease-in duration-300 shadow-md hover:shadow-xl flex flex-col items-center justify-between space-y-4">
          <div className="w-full h-10 sm:h-30 flex items-center justify-center pt-6 sm:pt-12">
            <Image
              src="https://res.cloudinary.com/dqobuxkcj/image/upload/v1744904250/Group_48_buvltt.png"
              width={70}
              height={70}
              alt=""
              className="w-8 h-8 sm:w-18 sm:h-16"
            />
          </div>
          <div className="w-full flex flex-col items-center justify-center text-center pb-8 sm:pb-10">
            <h1 className="font-bold text-sm sm:text-lg">Calculated Weather</h1>
            <p className="text-gray-600 text-sm font-semibold mt-2 px-6 hidden sm:block">
              Stay ahead with real-time weather forecasts. Plan your trips with
              precision using accurate data.
            </p>
          </div>
        </div>
        <div className="rounded-4xl transition-all ease-in duration-300 shadow-md hover:shadow-xl flex flex-col items-center justify-between space-y-4">
          <div className="w-full sm:h-30 flex items-center justify-center pt-6 sm:pt-12">
            <Image
              src="https://res.cloudinary.com/dqobuxkcj/image/upload/c_crop,w_130,h_100/v1744904250/Group_51_xkccnl.png"
              width={100}
              height={100}
              alt=""
              className="w-16 h-12 sm:w-24 sm:h-20"
            />
          </div>
          <div className="w-full flex flex-col items-center justify-center text-center pb-8 sm:pb-10">
            <h1 className="font-bold text-sm sm:text-lg">Best Flights</h1>
            <p className="text-gray-600 text-sm font-semibold mt-2 px-6 hidden sm:block">
              Find top-rated flights at unbeatable prices. Book with ease and
              travel in comfort.
            </p>
          </div>
        </div>
        <div className="rounded-4xl transition-all ease-in duration-300 shadow-md hover:shadow-xl flex flex-col items-center justify-between space-y-4">
          <div className="w-full sm:h-30 flex items-center justify-center pt-6 sm:pt-12">
            <Image
              src="https://res.cloudinary.com/dqobuxkcj/image/upload/v1744904249/Group_50_q1zdag.png"
              width={60}
              height={60}
              alt=""
              className="w-8 h-8 sm:w-16 sm:h-16"
            />
          </div>
          <div className="w-full flex flex-col items-center justify-center text-center pb-8 sm:pb-10">
            <h1 className="font-bold text-sm sm:text-lg">Local Events</h1>
            <p className="text-gray-600 text-sm font-semibold mt-2 px-6 hidden sm:block">
              Discover exciting events at your destination. Enjoy immersive
              cultural experiences.
            </p>
          </div>
        </div>
        <div className="rounded-4xl transition-all ease-in duration-300 shadow-md hover:shadow-xl flex flex-col items-center justify-between space-y-4">
          <div className="w-full sm:h-30 flex items-center justify-center pt-6 sm:pt-12">
            <Image
              src="https://res.cloudinary.com/dqobuxkcj/image/upload/v1744904249/Group_49_apy588.png"
              width={70}
              height={70}
              alt=""
              className="w-8 h-8 sm:w-18 sm:h-16"
            />
          </div>
          <div className="w-full flex flex-col items-center justify-center text-center pb-8 sm:pb-10">
            <h1 className="font-bold text-sm sm:text-lg">Customization</h1>
            <p className="text-gray-600 text-sm font-semibold mt-2 px-6 hidden sm:block">
              Tailor your travel experience to your needs. Perfect for
              corporate, family, or military travel.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Services;
