const PhotoUploadPreview = ({ files, isUploading, setFiles }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',

        margin: 'calc(-15px + 30px) -15px 0 0',
      }}
    >
      {files.map((x, index) => (
        <div
          key={x.name}
          style={{
            // marginTop: "0px"
            margin: '15px 15px 0 0',
            width: '150px',
          }}
        >
          <div
            style={{
              marginTop: '0px',
              border: '1px solid #b1b4b6',
              width: '150px',
              height: '150px',
              padding: '5px',
              boxSizing: 'border-box',
            }}
          >
            <img
              style={{
                objectFit: 'contain',
                width: '100%',
                height: '100%',
                // height: '150px', width: 'auto'
              }}
              src={URL.createObjectURL(x)}
              alt="Preview Uploaded Image"
              id="file-preview"
            />
          </div>

          <button
            style={{
              flexShrink: '0',
              flexGrow: '0',
              marginTop: '5px',
              display: 'block',
              background: 'none',
              border: 'none',
              textDecoration: 'underline',
              color: '#025ea6',
              textAlign: 'right',
              width: '100%',
              padding: 0,
            }}
            type="button"
            onClick={() => {
              if (isUploading) return
              setFiles((files) => {
                var newArr = [...files]
                newArr.splice(index, 1)
                return newArr
              })
            }}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  )
}

export default PhotoUploadPreview
