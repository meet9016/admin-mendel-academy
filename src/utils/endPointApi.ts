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
    getByIdExamList?: string;
    updateExamList?: string;

    //FAQ
    getAllFaq?: string;
    createFaq?: string;
    updateFaq?: string;
    deleteFaq?: string;
    getByIdFaq?: string;

    //Payment
    getAllPayment?: string;
    getPaymentDownloadExcel?: string;

    //Contact-Us
    getAllContact?: string;
    deleteContact?: string;

    //Upcomeing-course
    createUpcomeing?: string;
    getAllUpcomeing?: string;
    deleteUpcomeing?: string;
    getByIdUpcomeing?: string;
    updateUpcomeing?: string;

    //Upcomeing-program
    createUpcomeingProgram?: string;
    getAllUpcomeingProgram?: string;
    deleteUpcomeingProgram?: string;
    getByIdUpcomeingProgram?: string;
    updateUpcomeingProgram?: string;

    //Hyper-Specialist
    createHyperSpecialist?: string;
    getAllHyperSpecialist?: string;
    deleteHyperSpecialist?: string;
    getByIdHyperSpecialist?: string;
    updateHyperSpecialist?: string;

    //Cart
    getAllCart?: string;
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
    getByIdExamList: 'examlist/getById',
    updateExamList: 'examlist/update',

    //FAQ
    getAllFaq: 'faq/getall',
    createFaq: 'faq/create',
    updateFaq: 'faq/update',
    deleteFaq: 'faq/delete',
    getByIdFaq: 'faq/getById',

    //Payment
    getAllPayment: 'payment/getall',
    getPaymentDownloadExcel: 'payment/download-excel',

    //Contact-Us
    getAllContact: 'contactus/getall',
    deleteContact: 'contactus/delete',

    //Upcomeing-course
    createUpcomeing: 'upcomming/create',
    getAllUpcomeing: 'upcomming/getall',
    deleteUpcomeing: 'upcomming/delete',
    getByIdUpcomeing: 'upcomming/getById',
    updateUpcomeing: 'upcomming/update',

    //Upcomeing-program
    createUpcomeingProgram: 'upcomming-program/create',
    getAllUpcomeingProgram: 'upcomming-program/getall',
    deleteUpcomeingProgram: 'upcomming-program/delete',
    getByIdUpcomeingProgram: 'upcomming-program/getById',
    updateUpcomeingProgram: 'upcomming-program/update',

    //Hyper-Specialist
    createHyperSpecialist: 'hyperSpecialist/create',
    getAllHyperSpecialist: 'hyperSpecialist/getall',
    deleteHyperSpecialist: 'hyperSpecialist/delete',
    getByIdHyperSpecialist: 'hyperSpecialist/getById',
    updateHyperSpecialist: 'hyperSpecialist/update',
    
    //Cart
    getAllCart: 'cart/get-all-cart',
};

export default endPointApi;