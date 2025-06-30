const timelineEvents = [
  {
    date: "07.2023",
    title: "FabricFocus ra đời",
    content:
      "Thành lập thương hiệu với sứ mệnh xây dựng phong cách cho nam giới hiện đại.",
  },
  {
    date: "10.2023",
    title: "Ra mắt bộ sưu tập đầu tiên",
    content:
      "Bộ sưu tập mở đầu gồm áo thun, sơ mi và quần jeans được đón nhận tích cực.",
  },
  {
    date: "12.2023",
    title: "Đạt mốc 10.000 đơn hàng",
    content:
      "Chỉ sau 5 tháng hoạt động, số lượng đơn hàng vượt kỳ vọng ban đầu.",
  },
  {
    date: "03.2024",
    title: "Nâng cấp giao diện và trải nghiệm mua sắm",
    content:
      "FabricFocus cải thiện thiết kế website và quy trình mua hàng dễ sử dụng hơn cho khách hàng.",
  },
  {
    date: "Dự kiến 2025",
    title: "Khai trương showroom đầu tiên",
    content:
      "Đánh dấu bước phát triển từ online đến trải nghiệm mua sắm trực tiếp.",
  },
];

const TimelineSection = () => {
  const activeIndex = 0; // hoặc dynamic từ state

  return (
    <section className="w-full max-w-[1160px] mx-auto px-4 pt-[100px] mb-8">
      <div className="text-center mb-12">
        <h2 className="text-[28px] md:text-[36px] font-bold text-foreground uppercase">
          Hành trình fabricfocus
        </h2>
        <p className="text-muted-foreground max-w-[680px] mx-auto text-sm md:text-base">
          Những cột mốc đáng nhớ trong quá trình phát triển thương hiệu.
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Line */}
        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-border z-0" />

        {/* Dots */}
        <div className="flex justify-between relative z-10 mb-10">
          {timelineEvents.map((_, idx) => (
            <div
              key={idx}
              className="w-4 h-4 rounded-full bg-background border border-border mx-auto"
            />
          ))}
        </div>

        {/* Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 z-10 relative">
          {timelineEvents.map((event, idx) => {
            return (
              <div
                key={idx}
                className={`group text-center border rounded-lg px-4 py-5 flex flex-col justify-center items-center h-full min-h-[160px] transition-all duration-300
          bg-muted text-foreground hover:border-primary hover:shadow-md hover:scale-[1.02]`}
              >
                <p className="text-xs font-semibold uppercase mb-1">
                  {event.date}
                </p>

                {/* 👇 Thêm group-hover:text-primary tại đây */}
                <h4 className="Title font-bold text-base mb-1 group-hover:text-primary duration-300">
                  {event.title}
                </h4>

                <p className="text-sm">{event.content}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
