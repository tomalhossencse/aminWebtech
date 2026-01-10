const axios = require('axios');

async function testProjectsAPI() {
  try {
    console.log('🔍 Testing projects API...');
    
    const response = await axios.get('http://localhost:3000/projects');
    console.log('📊 Response status:', response.status);
    console.log('📝 Response data structure:', {
      totalProjects: response.data.projects?.length || 0,
      totalCount: response.data.total,
      page: response.data.page,
      totalPages: response.data.totalPages
    });
    
    if (response.data.projects && response.data.projects.length > 0) {
      console.log('\n✅ Sample project data:');
      const sampleProject = response.data.projects[0];
      console.log({
        id: sampleProject._id,
        title: sampleProject.title,
        category: sampleProject.category,
        clientName: sampleProject.clientName,
        technologies: sampleProject.technologies,
        hasImage: !!sampleProject.image,
        hasProjectUrl: !!sampleProject.projectUrl,
        status: sampleProject.status,
        createdAt: sampleProject.createdAt
      });
      
      console.log('\n📋 All projects:');
      response.data.projects.forEach((project, index) => {
        console.log(`${index + 1}. "${project.title}" - ${project.category} (${project.status})`);
      });
    } else {
      console.log('❌ No projects found in response');
    }
    
  } catch (error) {
    console.error('❌ Error testing projects API:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

testProjectsAPI();