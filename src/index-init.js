export const handler = async (event) => {
    // TODO implement
    console.log("event!!", event);
    const defaultResponse = {
    "apiversion": "1",
    "author": "teamX",
    "color": "#125",
    "head": "chicken",
    "tail": "chicken",
    "version": "1.0.0"
    };
    
    return defaultResponse;
  };
  