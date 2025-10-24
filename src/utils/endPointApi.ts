export interface EndPointApi {
    login: string;
    register: string;
    logout: string;

    //Blogs
    getAllBlogs?: string;
    createBlog?: string;
    updateBlog?: string;
    deleteBlog?: string;

    //Question
    getAllQuestion?: string;
    getByIdQuestion?: string;
    createQuestion?: string;
    updateQuestion?: string;
    deleteQuestion?: string;
}

// Define and export the API endpoint object
const endPointApi: EndPointApi = {
    login: 'auth/login',
    register: 'auth/register',
    logout: 'auth/logout',

    //Blogs
    getAllBlogs: 'blogs/getall',
    createBlog: 'blogs/create-blogs',
    updateBlog: 'blogs',
    deleteBlog: 'blogs/delete',

    //Question
    getAllQuestion: 'question/getall',
    getByIdQuestion : 'question/getById',
    createQuestion: 'question/create-question',
    updateQuestion: 'question/update',
    deleteQuestion: 'question/delete',
};

export default endPointApi;