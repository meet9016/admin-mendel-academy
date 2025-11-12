export interface EndPointApi {
    login: string;
    register: string;
    logout: string;

    //Blogs
    getAllBlogs?: string;
    getByIdBlogs?: string;
    createBlog?: string;
    updateBlog?: string;
    deleteBlog?: string;

    //Question
    getAllQuestion?: string;
    getByIdQuestion?: string;
    createQuestion?: string;
    updateQuestion?: string;
    deleteQuestion?: string;

    //Pre-Recorded
    getAllPreRecorded?: string;
    getByIdPreRecorded?: string;
    createPreRecorded?: string;
    updatePreRecorded?: string;
    deletePreRecorded?: string;

    //Live-Courses
    getAllLiveCourses?: string;
    getByIdLiveCourses?: string;
    createLiveCourses?: string;
    updateLiveCourses?: string;
    deleteLiveCourses?: string;

    //Exam-List
    getAllExamList?: string;
    createExamList?: string;
    deleteExamList?: string;

    //FAQ
    getAllFaq?: string;
    createFaq?: string;
    updateFaq?: string;
    deleteFaq?: string;
    getByIdFaq?: string;

    //Payment
    getAllPayment?: string;
}

// Define and export the API endpoint object
const endPointApi: EndPointApi = {
    login: 'auth/login',
    register: 'auth/register',
    logout: 'auth/logout',

    //Blogs
    getAllBlogs: 'blogs/getall',
    getByIdBlogs: 'blogs/getById',
    createBlog: 'blogs/create-blogs',
    updateBlog: 'blogs/update',
    deleteBlog: 'blogs/delete',

    //Question
    getAllQuestion: 'question/getall',
    getByIdQuestion: 'question/getById',
    createQuestion: 'question/create-question',
    updateQuestion: 'question/update',
    deleteQuestion: 'question/delete',

    //Pre-Recorded
    getAllPreRecorded: 'prerecorded/getall',
    getByIdPreRecorded: 'prerecorded/getById',
    createPreRecorded: 'prerecorded/create',
    updatePreRecorded: 'prerecorded/update',
    deletePreRecorded: 'prerecorded/delete',

    //Live-Courses
    getAllLiveCourses: 'livecourses/getall',
    getByIdLiveCourses: 'livecourses/getById',
    createLiveCourses: 'livecourses/create',
    updateLiveCourses: 'livecourses/update',
    deleteLiveCourses: 'livecourses/delete',

    //Exam-List
    getAllExamList: 'examlist/getall',
    createExamList: 'examlist/create',
    deleteExamList: 'examlist/delete',

    //FAQ
    getAllFaq: 'faq/getall',
    createFaq: 'faq/create',
    updateFaq: 'faq/update',
    deleteFaq: 'faq/delete',
    getByIdFaq: 'faq/getById',

    //Payment
    getAllPayment: 'payment/getall',
};

export default endPointApi;