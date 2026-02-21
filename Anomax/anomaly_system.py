import pandas as pd
import matplotlib.pyplot as plt
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import IsolationForest

def detect_anomalies(file_path):

    # -------- 1. Load dataset --------
    df = pd.read_csv(file_path)

    # -------- 2. Create datetime --------
    df['Datetime'] = pd.to_datetime(df['Date'] + ' ' + df['Time'])
    df.set_index('Datetime', inplace=True)
    df.drop(columns=['Date','Time'], inplace=True)

    # -------- 3. Convert numeric --------
    df['Global_active_power'] = pd.to_numeric(df['Global_active_power'], errors='coerce')

    # Remove missing
    df = df.dropna()

    # -------- 4. Resample hourly --------
    power_hourly = df['Global_active_power'].resample('H').mean().dropna()

    # -------- 5. Scaling --------
    scaler = StandardScaler()
    power_scaled = scaler.fit_transform(power_hourly.values.reshape(-1,1))
    power_scaled = pd.DataFrame(power_scaled, index=power_hourly.index, columns=['scaled_power'])

    # -------- 6. Train/Test split --------
    split_index = int(len(power_scaled)*0.8)
    train = power_scaled.iloc[:split_index]
    test = power_scaled.iloc[split_index:]

    # -------- 7. Train model --------
    model = IsolationForest(contamination=0.01, random_state=42)
    model.fit(train)

    # -------- 8. Predict --------
    train['anomaly'] = model.predict(train)
    test['anomaly'] = model.predict(test)

    result = pd.concat([train,test])

    # -------- 9. Extract anomalies --------
    anomalies = result[result['anomaly'] == -1]

    print("Total anomalies:", len(anomalies))
    print("\nFirst 10 anomaly timestamps:")
    print(anomalies.index[:10])

    # -------- 10. Plot --------
    plt.figure(figsize=(15,5))
    plt.plot(result.index, result['scaled_power'], label='Normal')
    plt.scatter(anomalies.index, anomalies['scaled_power'], color='red', label='Anomaly')
    plt.legend()
    plt.title("Electricity Consumption Anomaly Detection")
    plt.show()