# AI-Driven Anomaly Detection in Electricity Consumption

## Project Overview
This project focuses on detecting abnormal electricity consumption patterns using machine learning techniques. The system analyzes historical electricity usage data and identifies unusual consumption behavior that may indicate energy wastage.

The project uses unsupervised anomaly detection methods to analyze electricity consumption data and highlight abnormal usage periods. Additionally, sub-metering data is analyzed to estimate the probable source of electricity wastage.

---

## Objectives
- Analyze electricity consumption patterns using data analysis techniques
- Detect abnormal electricity usage using machine learning
- Visualize electricity consumption trends and anomalies
- Estimate possible source of wastage using sub-metering data
- Support energy efficiency and better electricity monitoring

---

## Dataset
The project uses a historical electricity consumption dataset from the **UCI Machine Learning Repository**.

Dataset features include:
- Date
- Time
- Global Active Power
- Global Reactive Power
- Voltage
- Global Intensity
- Sub Metering 1 (Kitchen)
- Sub Metering 2 (Laundry)
- Sub Metering 3 (Heating / AC)

---

## Technologies Used

### Programming Language
- Python

### Libraries
- Pandas
- NumPy
- Scikit-learn
- Matplotlib

### Development Tools
- Jupyter Notebook
- VS Code
- GitHub

### Machine Learning Approach
- Unsupervised Learning
- Isolation Forest (Anomaly Detection)

---

## System Workflow

1. Load electricity consumption dataset  
2. Perform data exploration and preprocessing  
3. Convert data into time-series format  
4. Apply anomaly detection model  
5. Detect abnormal electricity consumption  
6. Visualize anomalies and usage patterns  
7. Analyze sub-metering data to estimate possible source of wastage  

---

## Project Structure

```
AnomaxR/
│
├── 01_data_exploration.ipynb
├── 01_data_preprocessing.ipynb
├── anomaly_detection.ipynb
├── sub_metering_analysis.ipynb
│
├── anomaly_system.py
├── run.py
│
└── README.md
```

---

## Current Progress

Completed modules:
- Dataset loading
- Data exploration
- Data preprocessing
- Anomaly detection model
- Visualization of anomalies

Work in progress:
- Sub-metering analysis
- Result interpretation
- User interface for dataset upload

---

## Future Improvements
- Develop a web interface for dataset upload
- Improve anomaly detection accuracy
- Extend system for real-time electricity monitoring
- Integrate with smart meter or IoT systems

---

## Contributors
- Yasmin
- Piyush
- Payal
- Aditya
- Vanshika

---

## References
- Himeur et al., Artificial Intelligence in Smart Energy Systems: A Review, Springer, 2023
- Liu et al., Anomalous Electricity Consumption Detection Based on Deep Learning, PeerJ Computer Science, 2023
- Solís-Villarreal et al., Energy Consumption Outlier Detection Using Artificial Intelligence, MDPI, 2022
- Zhang et al., Unsupervised Detection of Abnormal Electricity Consumption Behavior Based on Feature Engineering, IEEE Access, 2020
- Liso et al., A Review of Deep Learning-Based Anomaly Detection Strategies in Industry 4.0, IEEE Access, 2024
