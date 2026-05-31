import api from "./api";

const categoriesService = {
    list: () => api.get('/categories'),
};

export default categoriesService;