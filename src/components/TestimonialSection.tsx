
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
          <div className="grid grid-cols-2 gap-8 items-center">
            {/* Quote */}
            <div className="space-y-6">
              <blockquote className="text-3xl font-normal text-blue-900 leading-tight">
                "Ik zag mezelf niet ineens<br />
                die switch maken, maar<br />
                wat ben ik blij dat ik het<br />
                gedaan heb!"
              </blockquote>
            </div>
            
            {/* Empty space to let background image show */}
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialSection;
