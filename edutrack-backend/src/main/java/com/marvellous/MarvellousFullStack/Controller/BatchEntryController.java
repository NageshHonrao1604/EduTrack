package com.marvellous.MarvellousFullStack.Controller;

import com.marvellous.MarvellousFullStack.Entity.BatchEntry;
import com.marvellous.MarvellousFullStack.Service.BatchEntryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/batches")
@CrossOrigin(origins = "*")   // ✅ FIXED: was "http://localhost:3000"
public class BatchEntryController
{
    @Autowired
    private BatchEntryService batchEntryService;

    @GetMapping
    public ResponseEntity<?> getAll()
    {
        List<BatchEntry> alldata = batchEntryService.getAll();
        return new ResponseEntity<>(alldata, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<BatchEntry> createEntry(@RequestBody BatchEntry myentry)
    {
        try
        {
            batchEntryService.saveEntry(myentry);
            return new ResponseEntity<>(myentry, HttpStatus.CREATED);
        }
        catch(Exception e)
        {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/id/{myid}")
    public ResponseEntity<?> deleteEntryById(@PathVariable String myid)   // ✅ FIXED: String instead of ObjectId
    {
        batchEntryService.deleteById(myid);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping("/id/{myid}")
    public ResponseEntity<?> updateEntryById(@PathVariable String myid, @RequestBody BatchEntry myentry)   // ✅ FIXED: String instead of ObjectId
    {
        BatchEntry old = batchEntryService.findById(myid).orElse(null);
        if(old != null)
        {
            old.setName(myentry.getName());
            old.setEmail(myentry.getEmail());    // ✅ ADDED
            old.setBatch(myentry.getBatch());    // ✅ ADDED
            old.setFees(myentry.getFees());
            batchEntryService.saveEntry(old);
            return new ResponseEntity<>(old, HttpStatus.OK);
        }
        else
        {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}


