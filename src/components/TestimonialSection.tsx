
const TestimonialSection = () => {
  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8 bg-gray-50">
      <div className="relative overflow-hidden rounded-3xl shadow-xl min-h-[300px]" style={{
        backgroundImage: "url('/lovable-uploads/f40f684e-643d-4161-be1c-240737966a76.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        {/* Light overlay for better text readability */}
        <div className="absolute inset-0 bg-white bg-opacity-20"></div>
        
        <div className="relative z-10 px-12 py-16">
          {/* Quote positioned on the left where background is lighter */}
          <div className="absolute left-12 top-1/2 transform -translate-y-1/2 max-w-md">
            {/* Additional subtle background for text readability */}
            <div className="bg-black bg-opacity-10 rounded-2xl p-6 backdrop-blur-sm">
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
