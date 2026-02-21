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
    convertLiveToPreRecord?: string;

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

    //Terms & Conditions
    postTermsAndConditions?: string;
    getAllTermsAndConditions?: string;

    //question bank related

    createSubject?: string;
    getAllSubject?: string;
    deleteSubject?: string;
    getByIdSubject?: string;
    updateSubject?: string;

    createChapter?: string;
    getAllChapter?: string;
    getChapterBySubject?: string;
    deleteChapter?: string;
    getByIdChapter?: string;
    updateChapter?: string;

    createTopic?: string;
    getAllTopic?: string;
    getTopicByChapter?: string;
    deleteTopic?: string;
    getByIdTopic?: string;
    updateTopic?: string;

    createQuestionBank?: string;
    getAllQuestionBank?: string;
    getQuestionBankByTopic?: string;
    deleteQuestionBank?: string;
    getByIdQuestionBank?: string;
    updateQuestionBank?: string;

    listDemoQuestions?: string;
    createDemoQuestion?: string;
    updateDemoQuestion?: string;
    deleteDemoQuestion?: string;
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
    convertLiveToPreRecord: 'livecourses/convert-to-prerecord',

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

    //Terms & Conditions
    postTermsAndConditions: 'terms-conditions/create', 
    getAllTermsAndConditions: 'terms-conditions/get', 

    //question bank related

    createSubject: 'subject/create',
    getAllSubject: 'subject/getall',
    deleteSubject: 'subject/delete',
    getByIdSubject: 'subject/get-by-id',
    updateSubject: 'subject/update',

    createChapter: 'chapter/create',
    getAllChapter: 'chapter/getall',
    getChapterBySubject: 'chapter/get-by-subject',
    deleteChapter: 'chapter/delete',
    getByIdChapter: 'chapter/get-by-id',
    updateChapter: 'chapter/update',

    createTopic: 'topic/create',
    getAllTopic: 'topic/getall',
    getTopicByChapter: 'topic/get-by-chapter',
    deleteTopic: 'topic/delete',
    getByIdTopic: 'topic/get-by-id',
    updateTopic: 'topic/update',

    createQuestionBank: 'questions/create',
    getAllQuestionBank: 'questions/getall',
    getQuestionBankByTopic: 'questions/get-by-topic',
    deleteQuestionBank: 'questions/delete',
    getByIdQuestionBank: 'questions/get-by-id',
    updateQuestionBank: 'questions/update',

    listDemoQuestions: 'demo-question/list',
    createDemoQuestion: 'demo-question/create',
    updateDemoQuestion: 'demo-question',
    deleteDemoQuestion: 'demo-question',

};

export default endPointApi;