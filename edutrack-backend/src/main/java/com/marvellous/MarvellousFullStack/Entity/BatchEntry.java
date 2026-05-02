package com.marvellous.MarvellousFullStack.Entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "BatchDetails")
public class BatchEntry {

    @Id
    private String id;
    private String name;
    private String email;
    private String batch;
    private int fees;
    private String feeStatus = "PENDING";

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getBatch() { return batch; }
    public void setBatch(String batch) { this.batch = batch; }

    public int getFees() { return fees; }
    public void setFees(int fees) { this.fees = fees; }

    public String getFeeStatus() { return feeStatus; }
    public void setFeeStatus(String feeStatus) { this.feeStatus = feeStatus; }
}