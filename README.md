#AI-Driven Anomaly Detection in Electricity Consumption

#Project Overview

This project focuses on detecting abnormal electricity consumption patterns using machine learning techniques. The system analyzes historical electricity usage data and identifies unusual consumption behavior that may indicate energy wastage.

The project uses unsupervised anomaly detection methods to analyze electricity consumption data and highlight abnormal usage periods. Additionally, sub-metering data is analyzed to estimate the probable source of electricity wastage.

The system has been extended into a full-stack application with a backend API and an interactive frontend dashboard for visualization and analysis.

---

#Objectives

- Analyze electricity consumption patterns using data analysis techniques
- Detect abnormal electricity usage using machine learning
- Visualize electricity consumption trends and anomalies
- Estimate possible source of wastage using sub-metering data
- Provide interactive dashboards for better understanding of energy usage
- Support energy efficiency and better electricity monitoring

---

#Dataset

The project uses a historical electricity consumption dataset from the UCI Machine Learning Repository.

#Dataset features include:

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

#Technologies Used

#Programming Language

- Python
- JavaScript

#Backend

- FastAPI

#Frontend

- React (Vite)
- CSS

#Libraries

- Pandas
- NumPy
- Scikit-learn (Isolation Forest)
- Matplotlib
- Seaborn

#Development Tools

- Jupyter Notebook
- VS Code
- GitHub

#Machine Learning Approach

- Unsupervised Learning
- Isolation Forest (Anomaly Detection)

---

#System Workflow

1. Load electricity consumption dataset
2. Perform data cleaning and preprocessing
3. Convert data into time-series format
4. Resample data into hourly usage for better pattern detection
5. Apply anomaly detection model (Isolation Forest)
6. Detect abnormal electricity consumption
7. Generate insights (peak usage, trends, waste detection)
8. Visualize results using graphs and dashboard
9. Analyze sub-metering data to estimate possible source of wastage

---

#Features

- Anomaly detection using Isolation Forest
- Interactive dashboard for visualization
- Hourly, daily, and monthly usage analysis
- Energy waste detection (night vs daytime usage)
- Sub-metering analysis (Kitchen, Laundry, Heating/AC)
- Correlation analysis between energy zones
- Upload dataset and analyze results dynamically

---

#Project Structure

AnomaxR/
│
├── backend/           # FastAPI backend + ML logic
│   ├── main.py
│   ├── anomaly_system.py
│   └── requirements.txt
│
├── frontend/          # React dashboard
│   ├── src/
│   ├── public/
│   └── package.json
│
├── notebooks/         # Data exploration & analysis
│   ├── anomaly_detection.ipynb
│   ├── data_exploration.ipynb
│   └── preprocessing.ipynb
│
├── uploads/           # Generated plots (ignored)
├── data/              # Dataset (ignored)
│
└── README.md

---

Current Progress

#Completed modules:

- Dataset loading
- Data exploration
- Data preprocessing
- Anomaly detection model
- Visualization of anomalies
- Backend API development (FastAPI)
- Frontend dashboard (React)
- Insights and analysis modules

#Work in progress:

- Advanced insight generation
- UI/UX improvements
- Enhanced explanation of results

---

#Future Improvements

- Real-time electricity monitoring
- Improve anomaly detection accuracy
- Advanced AI-based explanation of anomalies
- Cloud deployment (AWS / Render)
- Integration with smart meters or IoT systems

---

#References

- Himeur et al., Artificial Intelligence in Smart Energy Systems: A Review, Springer, 2023
- Liu et al., Anomalous Electricity Consumption Detection Based on Deep Learning, PeerJ Computer Science, 2023
- Solís-Villarreal et al., Energy Consumption Outlier Detection Using Artificial Intelligence, MDPI, 2022
- Zhang et al., Unsupervised Detection of Abnormal Electricity Consumption Behavior Based on Feature Engineering, IEEE Access, 2020
- Liso et al., A Review of Deep Learning-Based Anomaly Detection Strategies in Industry 4.0, IEEE Access, 2024