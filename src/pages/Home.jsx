import { useState } from 'react'
import Header from '../components/Header'
import ContentSection from '../components/ContentSection'
import ChatAssistant from '../components/ChatAssistant'
import FloatingChatButton from '../components/FloatingChatButton'

function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      text: 'Hello! 👋 Welcome to KPRCAS College. How can I help you today?',
      sender: 'bot'
    },
    {
      id: 2,
      text: "What's your name?",
      sender: 'bot'
    }
  ])
  const [userData, setUserData] = useState(null)
  const [showEmailPrompt, setShowEmailPrompt] = useState(true)

  const handleSendMessage = async (message) => {
    if (message.trim()) {
      setChatMessages([...chatMessages, {
        id: chatMessages.length + 1,
        text: message,
        sender: 'user'
      }])
      
      // Save user message to database
      saveMessage(message)

      // Fetch college data and Q&A pairs
      try {
        const response = await fetch('http://localhost:5000/data')
        const collegeData = await response.json()
        
        let botResponse = generateBotResponse(message, collegeData)
        
        // Bot response with delay
        setTimeout(() => {
          setChatMessages(prev => [...prev, {
            id: prev.length + 1,
            text: botResponse,
            sender: 'bot'
          }])
          // Save bot response to database
          saveBotMessage(botResponse)
        }, 500)
      } catch (error) {
        console.error('Failed to fetch college data:', error)
        // Fallback response if data fetch fails
        setTimeout(() => {
          const fallbackMessage = 'Thank you for your message. Our support team will get back to you soon!'
          setChatMessages(prev => [...prev, {
            id: prev.length + 1,
            text: fallbackMessage,
            sender: 'bot'
          }])
          // Save bot response to database
          saveBotMessage(fallbackMessage)
        }, 500)
      }
    }
  }

  const generateBotResponse = (userMessage, collegeData) => {
    const message = userMessage.toLowerCase()
    
    // Use course search utility
    const searchResult = searchCourses(message, collegeData)

    if (searchResult) {
      if (searchResult.type === 'degree') {
        return formatDegreeResponse(searchResult.data, collegeData)
      } else if (searchResult.type === 'course') {
        return formatCourseResponse(searchResult.data, collegeData)
      }
    }

    // Check FAQs
    if (collegeData.faqs && collegeData.faqs.length > 0) {
      const faqMatch = collegeData.faqs.find(faq => 
        message.includes(faq.question.toLowerCase().split(' ')[0]) ||
        faq.question.toLowerCase().split(' ').some(word => message.includes(word))
      )
      if (faqMatch) {
        return faqMatch.answer
      }
    }
    
    // Check for college info queries
    if (message.includes('name') || message.includes('college')) {
      return `${collegeData.college.name} is established in ${collegeData.college.established_year} and is affiliated with ${collegeData.college.affiliation}. \n\nFor admissions, contact: ${collegeData.integration_links.contact_admission}`
    }
    
    // Check for contact queries
    if (message.includes('contact') || message.includes('phone') || message.includes('email')) {
      return `You can reach us at:\nEmail: ${collegeData.college.contact.email}\nPhone: ${collegeData.college.contact.phone.join(', ')}\n\nFor admission queries: ${collegeData.integration_links.contact_admission}`
    }
    
    // Check for programs queries
    if (message.includes('program') || message.includes('course') || message.includes('study')) {
      const programs = collegeData.academics.schools.map(school => `${school.name}: ${school.programs.join(', ')}`).join('\n\n')
      return `We offer programs across multiple schools:\n\n${programs}\n\nWould you like to know more about a specific program? Apply here: ${collegeData.integration_links.apply_now}`
    }
    
    // Check for admissions queries
    if (message.includes('admission') || message.includes('apply')) {
      return `Admissions for ${collegeData.admissions.current_academic_year} are currently ${collegeData.admissions.open ? 'open' : 'closed'}. We offer ${collegeData.admissions.courses_offered.length} different courses.\n\nApply now: ${collegeData.integration_links.direct_application_form}\n\nFor more info: ${collegeData.integration_links.contact_admission}`
    }
    
    // Check for location queries
    if (message.includes('location') || message.includes('address') || message.includes('where')) {
      const loc = collegeData.college.location
      return `We are located at: ${loc.address}, ${loc.state}, ${loc.country} (${loc.postcode})`
    }
    
    // Default response
    return `Thank you for your message! I can help you with:\n• Course information (B.Sc, B.Com, BBA)\n• Admissions details\n• College location and contact\n• Academic programs\n\nOur admission team will also reach out to you. Contact: ${collegeData.integration_links.contact_admission}`
  }

  const handleEmailSubmit = (userInfo) => {
    setUserData(userInfo)
    setShowEmailPrompt(false)
    setChatMessages(prev => [...prev, {
      id: prev.length + 1,
      text: `Great! Thanks ${userInfo.name}. I have your contact information. How can I assist you further?`,
      sender: 'bot'
    }])
    
    // Save user to database
    saveUserToDatabase(userInfo)
  }

  const saveUserToDatabase = async (userInfo) => {
    try {
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: userInfo.name,
          email: userInfo.email,
          phone: userInfo.number
        })
      })
      
      if (response.ok) {
        console.log('User saved successfully')
      } else {
        console.error('Failed to save user')
      }
    } catch (error) {
      console.error('Error saving user:', error)
    }
  }

  const saveMessage = async (message) => {
    try {
      await fetch('http://localhost:5000/api/messages/chatbot/save', {
        method: 'POST',
        headers: {  
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          user_email: userData?.email || 'guest',
          user_name: userData?.name || 'guest',
          user_phone: userData?.number || 'N/A',
          message,
          message_type: 'user'
        })
      })
    } catch (error) {
      console.error('Failed to save message:', error)
    }
  }

  const saveBotMessage = async (message) => {
    try {
      await fetch('http://localhost:5000/api/messages/chatbot/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_email: userData?.email || 'guest',
          user_name: userData?.name || 'guest',
          user_phone: userData?.number || 'N/A',
          message,
          message_type: 'bot'
        })
      })
    } catch (error) {
      console.error('Failed to save bot message:', error)
    }
  }

  const addMessageToChat = (text, sender) => {
    setChatMessages(prev => [...prev, {
      id: prev.length + 1,
      text,
      sender
    }])
  }

  return (
    <div className="app">
      <Header />
      <div className="main-content">
        <div className="sections-container">
          <ContentSection
            title="About Our College"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            additionalText="Our college offers excellent academic programs and student support services to help you succeed."
          />
          <ContentSection
            title="Academic Programs"
            description="We offer a wide range of undergraduate and postgraduate programs designed to meet the needs of today's students."
            additionalText="Each program is carefully crafted to provide hands-on learning experiences and industry-relevant skills."
          />
          <ContentSection
            title="Student Support"
            description="Our dedicated team is committed to supporting your academic journey and personal growth outside the class."
            additionalText="We provide tutoring, guidance, and mentoring programs to help you achieve your goals."
          />
        </div>

        {isChatOpen && (
          <ChatAssistant
            messages={chatMessages}
            onSendMessage={handleSendMessage}
            onEmailSubmit={handleEmailSubmit}
            showEmailPrompt={showEmailPrompt}
            onClose={() => setIsChatOpen(false)}
            onAddMessage={addMessageToChat}
            userData={userData}
          />
        )}
      </div>

      <FloatingChatButton 
        isOpen={isChatOpen}
        onClick={() => setIsChatOpen(!isChatOpen)}
      />
    </div>
  )
}

export default Home
