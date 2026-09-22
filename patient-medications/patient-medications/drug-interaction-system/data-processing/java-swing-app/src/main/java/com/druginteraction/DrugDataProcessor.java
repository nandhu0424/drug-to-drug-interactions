package com.druginteraction;

import javax.swing.*;
import java.awt.*;

public class DrugDataProcessor extends JFrame {

    public DrugDataProcessor() {
        setTitle("Drug Interaction Data Processor");
        setSize(800, 600);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);

        JLabel label = new JLabel("Data Processing Module Running", SwingConstants.CENTER);
        label.setFont(new Font("Arial", Font.BOLD, 24));
        add(label);
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            DrugDataProcessor app = new DrugDataProcessor();
            app.setVisible(true);
            System.out.println("🚀 Java Swing Desktop App started...");
        });
    }
}
