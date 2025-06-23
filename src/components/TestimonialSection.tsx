
const TestimonialSection = () => {
  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8 bg-gray-50">
      <div className="relative overflow-hidden rounded-3xl shadow-xl min-h-[300px]" style={{
        backgroundImage: "url('/lovable-uploads/3e3e3d08-b7d5-4902-aa28-370ce017308e.png')",
        backgroundSize: '150%',
        backgroundPosition: 'right center',
        backgroundRepeat: 'no-repeat'
      }}>
        {/* Slightly darker overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="relative z-10 px-12 py-16 flex items-center min-h-[300px]">
          {/* Text positioned on the left, using more of the image space */}
          <div className="max-w-lg">
            <blockquote className="text-3xl font-bold leading-tight text-left" style={{
              color: '#FFFFFF',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
            }}>
              "Het lijkt wel magie: dat een<br />
              paar vragen zulke passende<br />
              functies op kunnen leveren!"
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialSection;
