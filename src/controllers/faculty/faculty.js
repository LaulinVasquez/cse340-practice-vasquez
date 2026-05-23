import { getFacultyBySlug,getSortedFaculty } from "../../models/faculty/faculty.js";

// Create a facultyListPage function that renders the faculty list page
const facultyListPage = async (req,res) =>{
    // handle sorting if requested
    const sortBy = req.query.sort || 'name';
    const faculty = await getSortedFaculty(sortBy);

    res.render("faculty/list", {
        title: " Faculty Directory",
        faculty: faculty,
        currentSort: sortBy
    });
}

// Create a facultyDetailPage function that uses route parameters to look up individual faculty
const facultyDetailPage = async (req, res, next) => {
    const facultySlug = req.params.facultySlug;
    const facultyMember = await getFacultyBySlug(facultySlug);
    console.log(facultyMember)

    if (Object.keys(facultyMember).length === 0) {
        const err = new Error(`Faculty member ${facultySlug} not found`);
        err.status = 404;
        return next(err);
    }
    res.render('faculty/detail', {
        title: `${facultyMember.firstName} - Faculty Profile`,
        faculty: facultyMember
    });
};
// Include proper error handling for invalid faculty IDs

// Export both functions

export { facultyListPage, facultyDetailPage};