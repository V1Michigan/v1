const getFileFromUrl = async (url: string, name: string, defaultType = "image/jpeg") => {
  const response = await fetch(url);
  const data = await response.blob();
  return new File([data], name, {
    type: data.type || defaultType,
  });
};

export default getFileFromUrl;
