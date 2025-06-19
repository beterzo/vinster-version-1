
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";

const WelcomeCard = () => {
  const { user } = useAuth();
  
  const getUserName = () => {
    if (user?.user_metadata?.first_name) {
      return user.user_metadata.first_name;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return '';
  };

  const userName = getUserName();

  return (
    <Card className="p-8 border-0 rounded-3xl" style={{ backgroundColor: '#E6F0F6' }}>
      <div className="space-y-4 text-left">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Welkom{userName && ` ${userName}`}
        </h1>
        <p className="text-gray-700 font-medium leading-relaxed mb-4">
          Dit is jouw persoonlijke dashboard. Hier zie je de voortgang van jouw loopbaanonderzoek en kun je 
          verder gaan waar je gebleven bent.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed mb-3">
          Hier start jouw loopbaantraject! We beginnen met de enthousiasmescan, de eerste stap om te 
          ontdekken wat jij graag doet en hoe jij graag werkt. In deze scan gaan we op zoek naar momenten 
          waarop jij in je element bent.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed mb-3">
          Door vragen te stellen over je jeugd, schooltijd en werkervaringen bregen we jouw unieke patroon 
          van voorkeuren en interesses in kaart.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed">
          Jouw enthousiasme is een belangijke indicator voor wat je echt leuk vind. Wanneer je iets doet 
          waar je enthousiast van wordt, ontstaat er energie en voldoening. Dáár gaan we naar op zoek.
        </p>
      </div>
    </Card>
  );
};

export default WelcomeCard;
