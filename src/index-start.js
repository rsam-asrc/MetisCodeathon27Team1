export const handler = async (event) => {
    // TODO implement
    console.log("event!", event);
    const response = {
      statusCode: 200,
      body: JSON.stringify('game started team 1'),
    };
    return response;
  };
  