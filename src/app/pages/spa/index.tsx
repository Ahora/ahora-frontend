import * as React from 'react';
import Nav from 'react-bootstrap/Nav';

export default class SPAHomePage extends React.Component {
  render = () => {
    return (
      <div>
        <h1>SPA</h1>
        <p>Manage <a href="https://github.com/ahora/spa">SPA</a> deployment with crds in kubernetes.</p>

        <Nav variant="tabs" defaultActiveKey="/spa">
          <Nav.Item>
            <Nav.Link href="/spa">home</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link>Videos</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link>Postmortems</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link>Wiki</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link>Milestones</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link>Retrospects</Nav.Link>
          </Nav.Item>
        </Nav>
        <h2>Repositories Structure</h2>
        <p>The project is based on from 3 repositories:</p>
        <ul>
          <li><a href="https://github.com/ahora/spa">SPA</a> - Simple nginx docker container that download archive file, extract it and serve static files</li>
          <li><a href="https://github.com/ahora/spa-operator">SPA-operator</a> - Managing kubernetes resources</li>
          <li><a href="https://github.com/ahora/spa-frontend">SPA-frontend</a> - Web interface to manage SPAs</li>
        </ul>
        <h2>Installation</h2>
        <div className="markdown-body">
          <div className="highlight highlight-source-shell">
            <pre>
              <span className="pl-c"><span className="pl-c">#</span> Setup Service Account</span><br />
              $ kubectl create -f deploy/service_account.yaml<br />
              <span className="pl-c"><span className="pl-c">#</span> Setup RBAC</span><br />
              $ kubectl create -f deploy/role.yaml<br />
              $ kubectl create -f deploy/role_binding.yaml<br />
              <span className="pl-c"><span className="pl-c">#</span> Setup the CRD</span><br />
              $ kubectl create -f deploy/crds/ahora.dev_spas_crd.yaml<br />
              <span className="pl-c"><span className="pl-c">#</span> Deploy the spa-operator</span><br />
              $ kubectl create -f deploy/operator.yaml<br />
              <span className="pl-c"><span className="pl-c">#</span> Create a SPA CR</span><br />
              $ kubectl create -f examples/example.yaml
              </pre>
          </div>
        </div>
        <h2>CR Example</h2>
        <div className="markdown-body">

          <div className="highlight highlight-source-yaml"><pre><span className="pl-ent">apiVersion</span>: <span className="pl-s">ahora.dev/v1alpha1</span>
            <span className="pl-ent">kind</span>: <span className="pl-s">SPA</span>
            <span className="pl-ent">metadata</span>:
  <span className="pl-ent">name</span>: <span className="pl-s">example-spa</span>
            <span className="pl-ent">annotations</span>:
    <span className="pl-ent">nginx.ingress.kubernetes.io/ssl-redirect</span>: <span className="pl-s"><span className="pl-pds">"</span>true<span className="pl-pds">"</span></span>
            <span className="pl-ent">spec</span>:
  <span className="pl-ent">SPAArchiveURL</span>: <span className="pl-s">https://storage.googleapis.com/ahora-spa-archives/spa-demo.tar.gz</span>
            <span className="pl-ent">replicas</span>: <span className="pl-c1">2</span>
            <span className="pl-ent">hosts</span>:
  - <span className="pl-s">www.example.com</span>
            - <span className="pl-s">example.com</span>
            <span className="pl-ent">tls</span>:
  - <span className="pl-ent">secretName</span>: <span className="pl-s">example-ssl</span>
            <span className="pl-ent">hosts</span>:
    - <span className="pl-s">www.example.com</span>
            - <span className="pl-s">example.com</span>
            <span className="pl-ent">livenessProbe</span>:
    <span className="pl-ent">httpGet</span>:
      <span className="pl-ent">path</span>: <span className="pl-s">/status</span>
            <span className="pl-ent">port</span>: <span className="pl-c1">80</span>
            <span className="pl-ent">initialDelaySeconds</span>: <span className="pl-c1">3</span>
            <span className="pl-ent">periodSeconds</span>: <span className="pl-c1">3</span>
            <span className="pl-ent">readinessProbe</span>:
    <span className="pl-ent">httpGet</span>:
      <span className="pl-ent">path</span>: <span className="pl-s">/status</span>
            <span className="pl-ent">port</span>: <span className="pl-c1">80</span>
            <span className="pl-ent">initialDelaySeconds</span>: <span className="pl-c1">3</span>
            <span className="pl-ent">periodSeconds</span>: <span className="pl-c1">3</span>
            <span className="pl-ent">resources</span>:
    <span className="pl-ent">requests</span>:
      <span className="pl-ent">memory</span>: <span className="pl-s"><span className="pl-pds">"</span>32Mi<span className="pl-pds">"</span></span>
            <span className="pl-ent">cpu</span>: <span className="pl-s"><span className="pl-pds">"</span>50m<span className="pl-pds">"</span></span>
            <span className="pl-ent">limits</span>:
      <span className="pl-ent">memory</span>: <span className="pl-s"><span className="pl-pds">"</span>64Mi<span className="pl-pds">"</span></span>
            <span className="pl-ent">cpu</span>: <span className="pl-s"><span className="pl-pds">"</span>100m<span className="pl-pds">"</span></span>
            <span className="pl-ent">paths</span>:
  - <span className="pl-ent">path</span>: <span className="pl-s">/api</span>
            <span className="pl-ent">backend</span>:
      <span className="pl-ent">serviceName</span>: <span className="pl-s">backendservice</span>
            <span className="pl-ent">servicePort</span>: <span className="pl-c1">80</span></pre></div>
        </div>
      </div>
    );
  };
}
