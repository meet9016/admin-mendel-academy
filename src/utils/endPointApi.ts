export interface EndPointApi {
    login: string;
    register: string;
    logout: string;

    //Blogs
    getAllBlogs?: string;
    createBlog?: string;
    updateBlog?: string;
    deleteBlog?: string;
}

// Define and export the API endpoint object
const endPointApi: EndPointApi = {
    login: 'auth/login',
    register: 'auth/register',
    logout: 'auth/logout',

    //Blogs
    getAllBlogs: 'blogs/getall',
    createBlog: 'blogs',
    updateBlog: 'blogs', // You might append the blog ID when making the request
    deleteBlog: 'blogs', // You might append the blog ID when making the request
};

export default endPointApi;