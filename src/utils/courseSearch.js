/**
 * Course Search Utility
 * Handles intelligent searching and filtering of courses
 */

export const searchCourses = (query, collegeData) => {
  const message = query.toLowerCase().trim();

  if (!collegeData.degree_groups) {
    return null;
  }

  // Search by degree name
  const degreeMatch = collegeData.degree_groups.find(dg =>
    dg.keywords.some(keyword => message.includes(keyword.toLowerCase()))
  );

  if (degreeMatch) {
    return {
      type: 'degree',
      data: degreeMatch,
      courses: degreeMatch.courses
    };
  }

  // Search by specific course
  for (let degreeGroup of collegeData.degree_groups) {
    const course = degreeGroup.courses.find(c =>
      c.keywords.some(keyword => message.includes(keyword.toLowerCase())) ||
      message.includes(c.course_name.toLowerCase())
    );

    if (course) {
      return {
        type: 'course',
        data: course,
        degree: degreeGroup.degree_name
      };
    }
  }

  // Search by category
  for (let degreeGroup of collegeData.degree_groups) {
    const coursesByCategory = degreeGroup.courses.filter(c =>
      message.includes(c.category.toLowerCase())
    );

    if (coursesByCategory.length > 0) {
      return {
        type: 'category',
        data: coursesByCategory,
        category: coursesByCategory[0].category
      };
    }
  }

  return null;
};

export const formatDegreeResponse = (degreeGroup, collegeData) => {
  const courseList = degreeGroup.courses
    .map(course =>
      `• ${course.course_name}\n  Duration: ${course.duration} | Intake: ${course.intake}\n  Department: ${course.department}`
    )
    .join('\n\n');

  return `${collegeData.response_templates.degree_search_response.replace('{degree_name}', degreeGroup.degree_name)}\n\n${courseList}\n\nWould you like more details about any course?\n\nApply now: ${collegeData.integration_links.apply_now}`;
};

export const formatCourseResponse = (course, collegeData) => {
  return `${collegeData.response_templates.single_course_response
    .replace('{course_name}', course.course_name)
    .replace('{duration}', course.duration)
    .replace('{department}', course.department)}\n\nCourse Code: ${course.course_code}\nCategory: ${course.category}\nStudent Intake: ${course.intake}\n\nApply now: ${collegeData.integration_links.apply_now}\nContact Admissions: ${collegeData.integration_links.contact_admission}`;
};

export const formatCategoryResponse = (courses, category, collegeData) => {
  const courseList = courses
    .map(course => `• ${course.course_name}`)
    .join('\n');

  return `Here are our ${category} programs:\n\n${courseList}\n\nFor more details, apply here: ${collegeData.integration_links.apply_now}`;
};

export const getAllCourses = (collegeData) => {
  const allCourses = [];

  if (collegeData.degree_groups) {
    collegeData.degree_groups.forEach(dg => {
      allCourses.push(...dg.courses);
    });
  }

  return allCourses;
};

export const getCoursesByDegree = (degreeName, collegeData) => {
  const degree = collegeData.degree_groups?.find(dg =>
    dg.degree_name.toLowerCase() === degreeName.toLowerCase()
  );

  return degree ? degree.courses : [];
};

export const getCoursesByCategory = (category, collegeData) => {
  const results = [];

  collegeData.degree_groups?.forEach(dg => {
    const filtered = dg.courses.filter(c =>
      c.category.toLowerCase() === category.toLowerCase()
    );
    results.push(...filtered);
  });

  return results;
};

export const getCourseByCode = (courseCode, collegeData) => {
  for (let dg of collegeData.degree_groups || []) {
    const course = dg.courses.find(c =>
      c.course_code.toLowerCase() === courseCode.toLowerCase()
    );
    if (course) {
      return course;
    }
  }
  return null;
};

