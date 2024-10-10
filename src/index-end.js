export const handler = async (event) => {
    // TODO implement
      console.log("event!", event);
    const response = {
      statusCode: 200,
      body: JSON.stringify('end game team X'),
    };
    return response;
  };
  