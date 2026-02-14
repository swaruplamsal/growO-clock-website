export default function PageHero({
  title,
  subtitle,
  backgroundImage = "/1.jpg",
}) {
  return (
    <section className="relative w-full h-[50vh] min-h-[400px] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      <div className="relative z-10 flex flex-col justify-center items-center h-full text-center px-4 pt-20">
        <h1 className="font-merriweather text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
          {title}
        </h1>
        {subtitle && (
          <p className="font-montserrat text-base md:text-lg text-gray-200 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
