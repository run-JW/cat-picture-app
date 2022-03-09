const API_ENDPOINT = 
  "https://zl3m4qq0l9.execute-api.ap-northeast-2.amazonaws.com/dev";


const request = async url => {
  try {
    const response = await fetch(url);
    return response.json();
  } catch (error) {
    // TODO Error Handling
    console.warn(error);
  }
};

const api = {
  fetchFiles: () => {
    return request(`${API_ENDPOINT}`);
  },
  fetchFilesFromId: nodeId => {
    return request(`${API_ENDPOINT}/${nodeId}`);
  },
  fetchImage: node => {
    return request(`https://fe-dev-matching-2021-03-serverlessdeploymentbuck-t3kpj3way537.s3.ap-northeast-2.amazonaws.com/public/${node.filePath}`);
  }
};

export default api;