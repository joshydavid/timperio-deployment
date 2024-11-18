import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import { Button, Typography, Card, message, Select, Tag, Input } from "antd";
import axios from "axios";
import "react-quill/dist/quill.snow.css";

const { Title } = Typography;
const { Option } = Select;

const DEFAULT_TEMPLATE = "";
export const NewsLetter = () => {
    const userRole = localStorage.getItem('role');
    const isAdmin = userRole === 'ADMIN';

    const DRAFT_KEY = "newsletter_draft";
    const [content, setContent] = useState("");
    const [isDraftLoaded, setIsDraftLoaded] = useState(false);
    const [emailList, setEmailList] = useState([
        "yoptestmail5@yopmail.com",
    ]); // Placeholder email list
    const [newEmail, setNewEmail] = useState("");

    const handleAddEmail = () => {
        if (newEmail && !emailList.includes(newEmail)) {
            setEmailList([...emailList, newEmail]);
            setNewEmail(""); // Clear input after adding
        }
    };

    const handleRemoveEmail = (emailToRemove) => {
        setEmailList(emailList.filter((email) => email !== emailToRemove));
    };

    // Segment
    const [customerSegment, setCustomerSegment] = useState("LOW_SPEND");

    // Get default template
    const fetchTemplates = async () => {
      try {
        const response = await axios.get(
            `${import.meta.env.VITE_SERVER}/api/v1/newsletter/getTemplates`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token_timperio")}`,
                    "Content-Type": "application/json",
                },
                
            }
        );
        const templates = response.data; // Assuming the API response contains templates
        if(templates){
            setContent(templates)
        }
        else {
          setContent(DEFAULT_TEMPLATE);
        }
      } catch (error) {
        message.error("Unable to load templates, using default template.");
        setContent(DEFAULT_TEMPLATE);
      }
    };
    useEffect(() => {
        if (!isDraftLoaded) {
          const savedDraft = localStorage.getItem(DRAFT_KEY);
          if (savedDraft) {
            setContent(savedDraft);
            message.info("Draft loaded from localStorage.");
          } else {
            fetchTemplates();
          }
          setIsDraftLoaded(true);
        }
      }, [isDraftLoaded]);

    // Save draft to localStorage
    const handleSaveAsDraft = () => {
        localStorage.setItem(DRAFT_KEY, content);
        message.success("Draft saved successfully!");
    };

    const handleResetTemplate = () => {
        fetchTemplates();
    }
    // Handle email sending
    
    const handleSend = async () => {  
        try {
            const updatedContent = content
            .replace(/class="ql-align-center"/g, 'style="text-align:center"')
            .replace(/class="ql-align-left"/g, 'style="text-align:left"')
            .replace(/class="ql-align-right"/g, 'style="text-align:right"');
            // Construct the POST body
            let selectedCustomerSegment = customerSegment
            if (customerSegment == "NULL"){
                selectedCustomerSegment = null
            }
            const payload = {
                customerSegment: selectedCustomerSegment, // Replace with dynamic segment if needed
                emails: emailList, // Use the selected recipients
                htmlContent: updatedContent
            };
    
            // Make the POST request
            const response = await axios.post(
                `${import.meta.env.VITE_SERVER}/api/v1/newsletter/send`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token_timperio")}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            message.success("Emails sent successfully!");
        } catch (error) {
            message.error("Failed to send emails.");
        }
    };

    const handleSetDefaultTemplate = async (newContent) => {
        try {
          // Construct the request body
          const payload = {
            htmlContent: content, // The new content for the template
          };
      
          // Make the PUT request to the backend
          const response = await axios.put(
            `${import.meta.env.VITE_SERVER}/api/v1/newsletter/setTemplates`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token_timperio")}`,
                    "Content-Type": "application/json",
                },
            }
          );
      
          // Handle successful response
          message.success("Template updated successfully!");
        } catch (error) {
          // Handle errors
          message.success("Failed to update template.");
        }
      };

    return (
        <div style={{ padding: "20px" }}>
        <Title level={2}>Email Template Editor</Title>
        {!isAdmin && (
            <>
                <div style={{ marginBottom: "20px" }}>
                    <Title level={5}>Choose a customer segment to send to:</Title>
                    <Select
                    placeholder="Choose segment"
                    style={{ width: "100%", marginBottom: "20px" }}
                    value={customerSegment}
                    onChange={setCustomerSegment}
                    >
                        <Option value="LOW_SPEND">Low Spend</Option>
                        <Option value="MID_TIER">Mid Tier</Option>
                        <Option value="HIGH_VALUE">High Value</Option>
                        <Option value="NULL">Sent only to selected recipients</Option>
                    </Select>
                </div>
                <div style={{ marginBottom: "20px" }}>
                    <Title level={5}>Enter recipients manually (optional):</Title>
                    <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                        <Input
                            placeholder="Enter a new email"
                            value={newEmail}
                            onPressEnter={handleAddEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                        />
                        <Button
                            type="primary"
                            onClick={handleAddEmail}
                            disabled={!newEmail || emailList.includes(newEmail)}
                        >
                            Add Email
                        </Button>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                        {emailList.map((email) => (
                            <Tag
                                key={email}
                                closable
                                onClose={() => handleRemoveEmail(email)}
                                style={{
                                    padding: "5px 10px",
                                    fontSize: "14px",
                                    borderRadius: "20px",
                                }}
                            >
                                {email}
                            </Tag>
                        ))}
                    </div>
                </div>
            </>
        )}
        <Card
            style={{
            borderRadius: "10px",
            marginBottom: "20px",
            }}
        >
            <ReactQuill
            value={content}
            onChange={setContent}
            modules={{
                toolbar: [
                [{ header: [1, 2, false] }],
                ["bold", "italic", "underline", "strike"],
                [{ list: "ordered" }, { list: "bullet" }],
                [{ align: [] }],
                // ["link", "image"],
                // ["clean"],
                ],
            }}
            formats={[
                "header",
                "bold",
                "italic",
                "underline",
                "strike",
                "list",
                "bullet",
                "align",
                // "link",
                // "image",
            ]}
            style={{ minHeight: "200px" }}
            />
        </Card>
        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <Button color="danger" variant="outlined" onClick={handleResetTemplate}>
                Reset
            </Button>
            <Button type="default" onClick={handleSaveAsDraft}>
            Save as Draft
            </Button>
            {!isAdmin && (
                <Button type="primary" onClick={handleSend}>
                Send
                </Button>
            )}
            {isAdmin && (
                <Button type="primary" onClick={handleSetDefaultTemplate}>
                Set Default Template
                </Button>
            )}
        </div>
        </div>
    );
};
