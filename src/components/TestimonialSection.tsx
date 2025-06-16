
const TestimonialSection = () => {
  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8 bg-gray-50">
      <div className="relative overflow-hidden rounded-3xl shadow-xl min-h-[300px]" style={{
        backgroundImage: "url('/lovable-uploads/f40f684e-643d-4161-be1c-240737966a76.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        {/* Light overlay for better background contrast */}
        <div className="absolute inset-0 bg-white bg-opacity-10"></div>
        
        <div className="relative z-10 px-12 py-16 flex items-center">
          {/* Blue testimonial box positioned on the left */}
          <div className="max-w-md">
            <div className="bg-blue-100 bg-opacity-90 rounded-2xl p-8 shadow-lg">
              <blockquote className="text-3xl font-normal text-blue-900 leading-tight">
                "Ik zag mezelf niet ineens<br />
                die switch maken, maar<br />
                wat ben ik blij dat ik het<br />
                gedaan heb!"
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialSection;
