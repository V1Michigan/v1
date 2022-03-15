const getFileFromUrl = async (
  url: string,
  name: string,
  defaultType = "image/jpeg"
) => {
  try {
    // This occasionally causes CORS errors on localhost
    const response = await fetch(url);
    const data = await response.blob();
    return new File([data], name, {
      type: data.type || defaultType,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return null;
  }
};

export default getFileFromUrl;
