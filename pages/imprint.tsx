import { Layout } from "../dashboard/components/Layout";

export default function Imprint() {
  return (
    <Layout>
      <h1 className="mb-4">Imprint</h1>

      <h2>Copyright</h2>
      <p>
        © The contents of the website are published in the World Wide Web for
        online access. Copyright for texts, images, graphic design and source
        code is owned by the University of Vienna and subject to legal
        protection. The production, use and non-commercial distribution of
        copies in electronic or printed form is allowed provided that the
        contents are not altered and the source is mentioned (Source: University
        of Vienna).
      </p>

      <h2>Liability</h2>
      <p>
        The text provided on the University of Vienna homepage has been reviewed
        with great care. However, the University of Vienna cannot guarantee the
        accuracy, completeness or validity of the information provided.
        Therefore the University of Vienna accepts no liability for the contents
        provided. Links to other websites have been carefully selected. However,
        the University of Vienna is not responsible for contents on any other
        websites.
      </p>

      <h2>Responsibility for contents and editing</h2>
      <address>
        <strong>Department of Communication</strong>
        <br />
        Kolingasse 14-16
        <br />
        1090 Vienna, Austria
        <br />
        info@opted.eu
        <br />
      </address>
    </Layout>
  );
}
