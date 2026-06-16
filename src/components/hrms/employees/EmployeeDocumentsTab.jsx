import { useState } from "react";
import { UploadCloud, FileText, Eye, Download, Trash2, CheckCircle, XCircle } from "lucide-react";
import axiosClient from "@/lib/axios";
import HasPermission from "@/components/rbac/HasPermission";

export default function EmployeeDocumentsTab({ 
  selectedEmp, 
  selectedCompanyId, 
  empDocuments, 
  loadDocuments 
}) {
  const [pendingDocs, setPendingDocs] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(f => ({
        fileObj: f,
        documentType: "OTHER"
      }));
      setPendingDocs(prev => [...prev, ...newFiles]);
    }
    e.target.value = null;
  };

  const handlePendingDocTypeChange = (index, value) => {
    setPendingDocs(prev => prev.map((f, i) => i === index ? { ...f, documentType: value } : f));
  };

  const handleRemovePendingDoc = (index) => {
    setPendingDocs(prev => prev.filter((_, i) => i !== index));
  };

  const handleConfirmUpload = async () => {
    if (pendingDocs.length === 0) return;
    setIsUploading(true);

    try {
      for (const item of pendingDocs) {
        const formData = new FormData();
        formData.append("file", item.fileObj);
        
        const uploadRes = await axiosClient.post("/attachments/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "x-company-id": selectedCompanyId,
          },
        });

        const fileUrl = uploadRes.data.fileUrl;
        
        await axiosClient.post(`/employees/${selectedEmp.id}/documents`, {
          documentType: item.documentType,
          fileName: item.fileObj.name,
          fileUrl: fileUrl,
        }, {
          headers: { "x-company-id": selectedCompanyId }
        });
      }
      alert("Documents uploaded successfully");
      setPendingDocs([]);
      loadDocuments(selectedEmp.id);
    } catch (err) {
      alert("Failed to upload document");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDocument = async (docId) => {
    try {
      await axiosClient.delete(`/employees/${selectedEmp.id}/documents/${docId}`, {
        headers: { "x-company-id": selectedCompanyId }
      });
      alert("Document deleted");
      loadDocuments(selectedEmp.id);
    } catch(err) {
      alert("Failed to delete");
    }
  };

  const handleVerify = async (docId, status) => {
    try {
      await axiosClient.put(`/employees/${selectedEmp.id}/documents/${docId}/verify`, {
        verificationStatus: status,
        verificationRemarks: status === 'REJECTED' ? "Document does not meet requirements" : "Verified successfully"
      }, {
        headers: { "x-company-id": selectedCompanyId }
      });
      alert(`Document ${status.toLowerCase()}`);
      loadDocuments(selectedEmp.id);
    } catch(err) {
      alert("Failed to verify document");
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors relative overflow-hidden">
        <input type="file" multiple id="docUpload" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileSelect} disabled={isUploading} />
        <div className="flex flex-col items-center gap-2">
          <UploadCloud className="h-6 w-6 text-gray-400" />
          <span className="text-sm font-bold text-[#007aff]">
            Click or drag to select files
          </span>
        </div>
      </div>

      {pendingDocs.length > 0 && (
        <div className="space-y-3 border border-blue-100 bg-blue-50/30 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-gray-800">Pending Uploads ({pendingDocs.length})</h3>
            <button onClick={handleConfirmUpload} disabled={isUploading} className="px-3 py-1.5 bg-[#007aff] text-white text-[10px] font-bold rounded-lg hover:bg-blue-600 disabled:opacity-50">
              {isUploading ? "Uploading..." : "Confirm Upload"}
            </button>
          </div>
          {pendingDocs.map((doc, i) => (
            <div key={i} className="flex justify-between items-center text-xs p-2 bg-white border border-blue-100 rounded-lg shadow-sm">
              <div className="flex flex-col">
                <span className="font-semibold text-gray-700 truncate max-w-[150px]">{doc.fileObj.name}</span>
                <span className="text-gray-400 text-[10px]">{(doc.fileObj.size / 1024).toFixed(1)} KB</span>
              </div>
              <div className="flex items-center gap-2">
                <select value={doc.documentType} onChange={(e) => handlePendingDocTypeChange(i, e.target.value)} className="border border-gray-200 rounded text-[10px] px-1 py-1 outline-none focus:border-[#007aff] bg-gray-50 text-gray-600">
                  <option value="PROFILE_PHOTO">Profile Photo</option>
                  <option value="AADHAAR">Aadhaar</option>
                  <option value="PAN">PAN</option>
                  <option value="RESUME">Resume</option>
                  <option value="OFFER_LETTER">Offer Letter</option>
                  <option value="OTHER">Other</option>
                </select>
                <button type="button" onClick={() => handleRemovePendingDoc(i)} className="text-red-500 hover:bg-red-50 p-1 rounded font-bold">X</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-3">
        {empDocuments.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-xs font-medium border border-gray-100 rounded-xl">
            No documents found.
          </div>
        ) : (
          empDocuments.map(doc => (
            <div key={doc.id} className="flex flex-col gap-2 p-3 border border-gray-100 rounded-xl bg-white shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">{doc.fileName}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-[10px] font-bold text-gray-400">{doc.documentType}</p>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                        doc.verificationStatus === 'VERIFIED' ? 'bg-green-100 text-green-700' :
                        doc.verificationStatus === 'REJECTED' ? 'bg-red-100 text-red-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {doc.verificationStatus || 'PENDING'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a href={`http://localhost:5000${doc.fileUrl}`} target="_blank" rel="noreferrer" className="p-1.5 text-gray-400 hover:text-[#007aff] hover:bg-blue-50 rounded-lg cursor-pointer">
                    <Eye className="h-4 w-4" />
                  </a>
                  <a href={`http://localhost:5000${doc.fileUrl}`} download className="p-1.5 text-gray-400 hover:text-[#007aff] hover:bg-blue-50 rounded-lg cursor-pointer">
                    <Download className="h-4 w-4" />
                  </a>
                  <button onClick={() => handleDeleteDocument(doc.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg cursor-pointer">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {/* HR Verification Controls */}
              {(!doc.verificationStatus || doc.verificationStatus === 'PENDING') && (
                <div className="flex justify-end gap-2 mt-2 pt-2 border-t border-gray-50">
                  <button 
                    onClick={() => handleVerify(doc.id, 'VERIFIED')}
                    className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-600 hover:bg-green-100 rounded text-[10px] font-bold"
                  >
                    <CheckCircle className="h-3 w-3" /> Verify
                  </button>
                  <button 
                    onClick={() => handleVerify(doc.id, 'REJECTED')}
                    className="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded text-[10px] font-bold"
                  >
                    <XCircle className="h-3 w-3" /> Reject
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
