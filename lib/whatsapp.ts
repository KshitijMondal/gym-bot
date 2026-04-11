// lib/whatsapp.ts

export const sendWhatsAppMessage = (phone: string, message: string) => {
    // Clean the phone number (remove spaces, dashes, etc.)
    const formattedPhone = phone.replace(/\D/g, "");
    
    // Encode the text so URLs can read it (handles spaces and line breaks)
    const encodedMessage = encodeURIComponent(message);
    
    // Generate the official Meta wa.me link
    const url = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
    
    // Open WhatsApp Web/Desktop in a new tab
    window.open(url, "_blank");
  };
  
  export const generateReceiptText = (gymName: string, memberName: string, plan: string) => {
    return `🏋️ *${gymName || "Our Gym"}* 🏋️\n\nHello *${memberName}*, \n\nThis is an automated confirmation that your payment for the *${plan} Plan* has been successfully received and your account is Active. \n\nThank you for training with us! 💪`;
  };
  
  export const generateReminderText = (gymName: string, memberName: string) => {
    return `⚠️ *${gymName || "Our Gym"}* - Payment Reminder ⚠️\n\nHello *${memberName}*, \n\nThis is a gentle reminder that your gym membership is currently marked as *Pending/Expired*. \n\nPlease clear your dues at the front desk to continue your training uninterrupted. \n\nIgnore this message if you have already paid!`;
  };