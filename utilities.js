var openSavFile = function(event, dataViewTableId, variableViewTableId, tabDivId) {
    
    // Get the file name
    var source = event.target;
	savFileName = source.files[0].name;
	
    var reader = new FileReader();
    
    reader.onload = function(){
    
        // Read the entire contents of the header file into the savFileContents varaible.
        
        savFileContents = reader.result;
        init();
        
        // Figure out what type of .SAV file this is (SAV/ZSAV/encrypted)
        var type = readFileType();
        
        if ( type == FileType.kSAV )
        {
            // Read the dictionary
            ReadSystemFileDictionary();
            
            // Make the table visible.
            $("#"+tabDivId).css('visibility', 'visible');
            
            // Show the dictionary
            displayDictionary(variableViewTableId);
            var dataTable = displayDataHeader(dataViewTableId);
            ReadAndDisplayData( dataTable );
        }
    };
    
    reader.readAsArrayBuffer(source.files[0]);
};