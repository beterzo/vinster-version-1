
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  const navigationLinks = [
    { title: "Over Vinster", path: "/over-vinster" },
    { title: "Voor wie is het", path: "/voor-wie-is-het" },
    { title: "Veelgestelde vragen", path: "/veelgestelde-vragen" },
    { title: "Contact", path: "/contact" },
    { title: "Privacy verklaring", path: "/privacy-verklaring" },
    { title: "Algemene voorwaarden", path: "/algemene-voorwaarden" },
  ];

  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-16">
      <div className="max-w-[1440px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo section */}
          <div className="flex items-start">
            <img 
              alt="Vinster Logo" 
              className="h-10 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200" 
              onClick={() => navigate('/')} 
              src="/lovable-uploads/208c47cf-042c-4499-94c1-33708e0f5639.png" 
            />
          </div>

          {/* Navigation links */}
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Navigatie</h3>
            <ul className="space-y-2">
              {navigationLinks.map((link) => (
                <li key={link.path}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="text-gray-600 hover:text-blue-900 transition-colors duration-200 text-left"
                  >
                    {link.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact information */}
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Contact</h3>
            <div className="space-y-2 text-gray-600">
              <p>
                <span className="font-medium">Email:</span><br />
                info@deloopbaanopleiding.nl
              </p>
              <p>
                <span className="font-medium">Telefoon:</span><br />
                +31 6 22 23 85 95
              </p>
              <p>
                <span className="font-medium">KvK nr:</span><br />
                04050762
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-300 mt-8 pt-6 text-center">
          <p className="text-gray-500 text-sm">
            © 2024 Vinster. Alle rechten voorbehouden.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
