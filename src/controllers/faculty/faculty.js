import { getAllfaculty,getFacultyById,getSortedFaculty } from "../../models/faculty/faculty.js";

// Create a facultyListPage function that renders the faculty list page
const facultyListPage = (req,res) =>{
    // handle sorting if requested
    const sortBy = req.query.sort || 'name';
    const faculty = getSortedFaculty(sortBy);
    console.log(facultyList)

    res.render("faculty/list", {
        title: " Faculty Page",
        faculty: faculty,
        currentSort: sortBy
    });
}

// Create a facultyDetailPage function that uses route parameters to look up individual faculty
const facultyDetailPage = (req, res, next) => {
    const facultyId = req.params.facultyId;
    const faculty = getFacultyById(facultyId);

    if (!faculty) {
        const err = new Error(`Faculty: ${faculty} not found, did you mean someone else?`)
        err.statis = 404;
        return next(err);
    }


    res.render('faculty/detail', {
        title: `${faculty.name}`,
        details: `${faculty.office}`,
        email: `${faculty.email}`,
        phone: `${faculty.phone}`,
        department: `${faculty.department}`,
 
    });
}
// Include proper error handling for invalid faculty IDs

// Export both functions

export { facultyListPage, facultyDetailPage};