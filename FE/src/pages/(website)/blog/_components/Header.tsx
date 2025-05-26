
const PageHeaderWithBreadcrumb = () => {
  return (
    <div className="mb-8">
      {/* Breadcrumb */}
      <div className="text-[11px] leading-[18px] uppercase text-[#888] breadcrumbs">
        <a className="bread" href="#">
          Trang chủ
        </a>
        <a href="#">
          Tin tức
        </a>
      </div>
    </div>
  );
};

export default PageHeaderWithBreadcrumb;
