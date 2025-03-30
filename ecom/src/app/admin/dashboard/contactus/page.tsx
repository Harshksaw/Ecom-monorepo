// import React, { useState, useEffect } from 'react';
// import { 
//   FaEye, 
//   FaTrash, 
//   FaCheck, 
//   FaArchive, 
//   FaSpinner, 
//   FaSearch,
//   FaEnvelope,
//   FaEnvelopeOpen,
//   FaReply,
//   FaFilter,
//   FaChevronLeft,
//   FaChevronRight
// } from 'react-icons/fa';

// // Types for the contact message
// interface ContactMessage {
//   _id: string;
//   name: string;
//   email: string;
//   phone?: string;
//   subject: string;
//   message: string;
//   status: 'new' | 'read' | 'responded' | 'archived';
//   createdAt: string;
//   updatedAt: string;
// }

// // Types for the API response
// interface ApiResponse {
//   success: boolean;
//   count: number;
//   pagination: {
//     total: number;
//     page: number;
//     limit: number;
//     totalPages: number;
//     hasMore: boolean;
//   };
//   data: ContactMessage[];
// }

// const ContactMessagesAdmin = () => {
//   // State variables
//   const [messages, setMessages] = useState<ContactMessage[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(10);
//   const [totalPages, setTotalPages] = useState(1);
//   const [total, setTotal] = useState(0);
//   const [statusFilter, setStatusFilter] = useState<string>('');
//   const [searchQuery, setSearchQuery] = useState('');

//   // Function to fetch messages
//   const fetchMessages = async () => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       // Build the query parameters
//       let url = `/api/contact?page=${page}&limit=${limit}`;
//       if (statusFilter) {
//         url += `&status=${statusFilter}`;
//       }
      
//       const response = await fetch(url);
//       const data: ApiResponse = await response.json();
      
//       if (!data.success) {
//         throw new Error(data.message || 'Failed to fetch messages');
//       }
      
//       setMessages(data.data);
//       setTotalPages(data.pagination.totalPages);
//       setTotal(data.pagination.total);
//     } catch (err) {
//       setError('Error fetching messages. Please try again.');
//       console.error('Error fetching messages:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Function to get a single message
//   const fetchMessage = async (id: string) => {
//     try {
//       const response = await fetch(`/api/contact/${id}`);
//       const data = await response.json();
      
//       if (!data.success) {
//         throw new Error(data.message || 'Failed to fetch message');
//       }
      
//       // Update the message in the list with the updated status (if it changed from 'new' to 'read')
//       setMessages(prevMessages => 
//         prevMessages.map(msg => 
//           msg._id === id ? { ...msg, status: data.data.status } : msg
//         )
//       );
      
//       setSelectedMessage(data.data);
//     } catch (err) {
//       console.error('Error fetching message details:', err);
//     }
//   };

//   // Function to update message status
//   const updateMessageStatus = async (id: string, status: string) => {
//     try {
//       const response = await fetch('/api/contact', {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ id, status }),
//       });
      
//       const data = await response.json();
      
//       if (!data.success) {
//         throw new Error(data.message || 'Failed to update message status');
//       }
      
//       // Update the message in the list
//       setMessages(prevMessages => 
//         prevMessages.map(msg => 
//           msg._id === id ? { ...msg, status: status } : msg
//         )
//       );
      
//       // Update the selected message if it's the one being updated
//       if (selectedMessage && selectedMessage._id === id) {
//         setSelectedMessage({ ...selectedMessage, status: status });
//       }
//     } catch (err) {
//       console.error('Error updating message status:', err);
//     }
//   };

//   // Function to delete a message
//   const deleteMessage = async (id: string) => {
//     if (!window.confirm('Are you sure you want to delete this message?')) {
//       return;
//     }
    
//     try {
//       const response = await fetch(`/api/contact/${id}`, {
//         method: 'DELETE',
//       });
      
//       const data = await response.json();
      
//       if (!data.success) {
//         throw new Error(data.message || 'Failed to delete message');
//       }
      
//       // Remove the message from the list
//       setMessages(prevMessages => 
//         prevMessages.filter(msg => msg._id !== id)
//       );
      
//       // Clear the selected message if it's the one being deleted
//       if (selectedMessage && selectedMessage._id === id) {
//         setSelectedMessage(null);
//       }
//     } catch (err) {
//       console.error('Error deleting message:', err);
//     }
//   };

//   // Function to format date
//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
//   };

//   // Get status badge color
//   const getStatusBadgeColor = (status: string) => {
//     switch (status) {
//       case 'new':
//         return 'bg-blue-100 text-blue-800';
//       case 'read':
//         return 'bg-gray-100 text-gray-800';
//       case 'responded':
//         return 'bg-green-100 text-green-800';
//       case 'archived':
//         return 'bg-purple-100 text-purple-800';
//       default:
//         return 'bg-gray-100 text-gray-800';
//     }
//   };

//   // Get status icon
//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case 'new':
//         return <FaEnvelope className="mr-1" />;
//       case 'read':
//         return <FaEnvelopeOpen className="mr-1" />;
//       case 'responded':
//         return <FaReply className="mr-1" />;
//       case 'archived':
//         return <FaArchive className="mr-1" />;
//       default:
//         return null;
//     }
//   };

//   // Effect to fetch messages on component mount and when page, limit, or statusFilter changes
//   useEffect(() => {
//     fetchMessages();
//   }, [page, limit, statusFilter]);

//   // Filtered messages based on search query
//   const filteredMessages = messages.filter(message => {
//     if (!searchQuery) return true;
    
//     const query = searchQuery.toLowerCase();
//     return (
//       message.name.toLowerCase().includes(query) ||
//       message.email.toLowerCase().includes(query) ||
//       message.subject.toLowerCase().includes(query) ||
//       message.message.toLowerCase().includes(query)
//     );
//   });

//   return (
//     <div className="bg-white p-6 rounded-lg shadow-md">
//       <h1 className="text-2xl font-bold mb-6">Contact Messages</h1>
      
//       {/* Filters and Search */}
//       <div className="flex flex-col md:flex-row justify-between mb-6">
//         <div className="flex space-x-2 mb-4 md:mb-0">
//           <div className="relative">
//             <select
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//               className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             >
//               <option value="">All Statuses</option>
//               <option value="new">New</option>
//               <option value="read">Read</option>
//               <option value="responded">Responded</option>
//               <option value="archived">Archived</option>
//             </select>
//             <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//               <FaFilter className="text-gray-400" />
//             </div>
//           </div>
          
//           <select
//             value={limit}
//             onChange={(e) => setLimit(Number(e.target.value))}
//             className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           >
//             <option value="5">5 per page</option>
//             <option value="10">10 per page</option>
//             <option value="25">25 per page</option>
//             <option value="50">50 per page</option>
//           </select>
//         </div>
        
//         <div className="relative">
//           <input
//             type="text"
//             placeholder="Search messages..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="pl-10 pr-4 py-2 w-full md:w-64 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           />
//           <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//             <FaSearch className="text-gray-400" />
//           </div>
//         </div>
//       </div>
      
//       {/* Messages List and Detail View */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {/* Messages List */}
//         <div className="md:col-span-1 border rounded-md overflow-hidden">
//           <div className="bg-gray-50 border-b p-3">
//             <h2 className="font-medium">Messages ({total})</h2>
//           </div>
          
//           {loading ? (
//             <div className="flex justify-center items-center h-64">
//               <FaSpinner className="animate-spin text-indigo-500 text-2xl" />
//             </div>
//           ) : error ? (
//             <div className="p-4 text-red-600">{error}</div>
//           ) : filteredMessages.length === 0 ? (
//             <div className="p-4 text-gray-500">No messages found.</div>
//           ) : (
//             <div className="max-h-96 overflow-y-auto">
//               {filteredMessages.map((message) => (
//                 <div
//                   key={message._id}
//                   className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
//                     selectedMessage?._id === message._id ? 'bg-indigo-50' : ''
//                   } ${message.status === 'new' ? 'font-semibold' : ''}`}
//                   onClick={() => fetchMessage(message._id)}
//                 >
//                   <div className="flex justify-between items-start mb-1">
//                     <div className="font-medium">{message.name}</div>
//                     <div className={`text-xs px-2 py-1 rounded-full flex items-center ${getStatusBadgeColor(message.status)}`}>
//                       {getStatusIcon(message.status)}
//                       {message.status}
//                     </div>
//                   </div>
//                   <div className="text-sm text-gray-600 truncate">{message.subject}</div>
//                   <div className="text-xs text-gray-500 mt-1">{formatDate(message.createdAt)}</div>
//                 </div>
//               ))}
//             </div>
//           )}
          
//           {/* Pagination */}
//           {!loading && !error && totalPages > 1 && (
//             <div className="p-3 border-t flex justify-between items-center">
//               <button
//                 onClick={() => setPage(prev => Math.max(prev - 1, 1))}
//                 disabled={page === 1}
//                 className="px-3 py-1 border rounded disabled:opacity-50 flex items-center"
//               >
//                 <FaChevronLeft className="mr-1" /> Prev
//               </button>
              
//               <span className="text-sm text-gray-600">
//                 Page {page} of {totalPages}
//               </span>
              
//               <button
//                 onClick={() => setPage(prev => (prev < totalPages ? prev + 1 : prev))}
//                 disabled={page === totalPages}
//                 className="px-3 py-1 border rounded disabled:opacity-50 flex items-center"
//               >
//                 Next <FaChevronRight className="ml-1" />
//               </button>
//             </div>
//           )}
//         </div>
        
//         {/* Message Detail */}
//         <div className="md:col-span-2 border rounded-md overflow-hidden">
//           {selectedMessage ? (
//             <div>
//               <div className="bg-gray-50 border-b p-4 flex justify-between items-center">
//                 <h2 className="font-medium">{selectedMessage.subject}</h2>
//                 <div className="flex space-x-2">
//                   {selectedMessage.status !== 'responded' && (
//                     <button
//                       onClick={() => updateMessageStatus(selectedMessage._id, 'responded')}
//                       className="text-sm px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 flex items-center"
//                     >
//                       <FaCheck className="mr-1" /> Mark Responded
//                     </button>
//                   )}
                  
//                   {selectedMessage.status !== 'archived' && (
//                     <button
//                       onClick={() => updateMessageStatus(selectedMessage._id, 'archived')}
//                       className="text-sm px-3 py-1 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 flex items-center"
//                     >
//                       <FaArchive className="mr-1" /> Archive
//                     </button>
//                   )}
                  
//                   <button
//                     onClick={() => deleteMessage(selectedMessage._id)}
//                     className="text-sm px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 flex items-center"
//                   >
//                     <FaTrash className="mr-1" /> Delete
//                   </button>
//                 </div>
//               </div>
              
//               <div className="p-4">
//                 <div className="mb-6 pb-4 border-b">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                     <div>
//                       <p className="text-sm text-gray-600">From:</p>
//                       <p className="font-medium">{selectedMessage.name}</p>
//                     </div>
                    
//                     <div>
//                       <p className="text-sm text-gray-600">Email:</p>
//                       <p className="font-medium">
//                         <a href={`mailto:${selectedMessage.email}`} className="text-indigo-600 hover:underline">
//                           {selectedMessage.email}
//                         </a>
//                       </p>
//                     </div>
                    
//                     {selectedMessage.phone && (
//                       <div>
//                         <p className="text-sm text-gray-600">Phone:</p>
//                         <p className="font-medium">
//                           <a href={`tel:${selectedMessage.phone}`} className="text-indigo-600 hover:underline">
//                             {selectedMessage.phone}
//                           </a>
//                         </p>
//                       </div>
//                     )}
                    
//                     <div>
//                       <p className="text-sm text-gray-600">Date:</p>
//                       <p className="font-medium">{formatDate(selectedMessage.createdAt)}</p>
//                     </div>
//                   </div>
//                 </div>
                
//                 <div>
//                   <h3 className="font-medium mb-2">Message:</h3>
//                   <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap">
//                     {selectedMessage.message}
//                   </div>
//                 </div>
                
//                 <div className="mt-6 pt-4 border-t">
//                   <h3 className="font-medium mb-4">Quick Reply:</h3>
//                   <div className="bg-gray-50 p-4 rounded-md">
//                     <textarea 
//                       className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                       rows={4}
//                       placeholder="Type your reply here..."
//                     ></textarea>
//                     <div className="flex justify-end mt-2">
//                       <button 
//                         className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center"
//                         onClick={() => {
//                           alert('Email feature would be implemented here. Status will be marked as responded.');
//                           updateMessageStatus(selectedMessage._id, 'responded');
//                         }}
//                       >
//                         <FaReply className="mr-2" /> Send Reply
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div className="flex flex-col items-center justify-center h-64 text-gray-500">
//               <FaEnvelope className="text-4xl mb-2" />
//               <p>Select a message to view its details</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ContactMessagesAdmin;
import React from 'react'

type Props = {}

const page = (props: Props) => {
  return (
    <div>page</div>
  )
}

export default page