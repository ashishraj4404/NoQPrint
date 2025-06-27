exports.uploadFiles = async (req, res) => {
  try {
    res.status(200).json(req.files); 
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "File upload failed" });
  }
};
