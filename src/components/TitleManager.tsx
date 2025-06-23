
import { useEffect, useLayoutEffect } from "react";

const TitleManager = () => {
  // Improved global title manager - ensures all pages show "Vinster" as title
  useLayoutEffect(() => {
    // Set title immediately before any rendering
    document.title = "Vinster";
  }, []);

  useEffect(() => {
    // Set title again after component mount
    document.title = "Vinster";
    
    // Create a more robust mutation observer to watch for title changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' || mutation.type === 'characterData') {
          if (document.title !== "Vinster") {
            console.log('Title changed to:', document.title, 'reverting to Vinster');
            document.title = "Vinster";
          }
        }
      });
    });
    
    // Observe title element and entire head for changes
    const titleElement = document.querySelector('title');
    if (titleElement) {
      observer.observe(titleElement, {
        childList: true,
        subtree: true,
        characterData: true
      });
    }
    
    observer.observe(document.head, {
      childList: true,
      subtree: true,
      characterData: true
    });
    
    // Additional backup interval check every 500ms
    const titleInterval = setInterval(() => {
      if (document.title !== "Vinster") {
        console.log('Interval check: Title was', document.title, 'setting to Vinster');
        document.title = "Vinster";
      }
    }, 500);
    
    return () => {
      observer.disconnect();
      clearInterval(titleInterval);
    };
  }, []);

  return null;
};

export default TitleManager;
